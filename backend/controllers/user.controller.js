const db = require('../models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const readXlsxFile = require("read-excel-file/node");

// Assigning users to the variable User
const User = db.User;
const Profile = db.Profile;
const UserProfile = db.UserProfile;
const Activity = db.Activity;
const UserActivityGroup = db.UserActivityGroup;


// signing a user up
// hashing users password before its saved to the database with bcrypt
exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConf, school, city } = req.body;
    
    // Check if password and passwordConf match
    if (password !== passwordConf) {
      return res.status(400).send("Password and password confirmation do not match.");
    }
    
    const data = {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      school,
      city
    };

    //saving the user
    const user = await User.create(data);
 
    //if user details is captured
    //generate token with the user's id and the secretKey in the env file
    // set cookie with the token generated
    if (user) {
      console.log("JWT_SECRET:", process.env.JWT_SECRET);
      let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });
 
      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      // console.log("user", JSON.stringify(user, null, 2));
      // console.log(token);
      //send users details
      return res.status(201).send(user);
    } else {
      return res.status(409).send("Details are not correct");
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.batchRegistration = async (req, res) => {
  console.log("Batch registration process started...");
  try {
    if (!req.file) {
      console.error("No file uploaded!");
      return res.status(400).send("Please upload an Excel file!");
    }

    const path = __basedir + "/uploads/" + req.file.filename;
    console.log(`File uploaded to path: ${path}`);

    const rows = await readXlsxFile(path);
    console.log("File successfully read. Total rows:", rows.length);

    // Skip header row
    rows.shift();
    console.log("Header row skipped. Processing rows...");

    let users = [];
    let profiles = [];

    // Process each row and prepare user & profile data
    for (const [index, row] of rows.entries()) {
      console.log(`Processing row ${index + 1}:`, row);
      console.log(`Row ${index + 1} field types:`, row.map(value => typeof value));

      if (row.length < 9) {
        console.error(`Row ${index + 1} has insufficient columns:`, row);
        return res.status(400).send({
          message: `Row ${index + 1} has insufficient columns.`,
          row,
        });
      }

      try {
         // 額外檢查數據有效性
        if (!row[2] || typeof row[2] !== "number" && typeof row[2] !== "string") {
          throw new Error(`Invalid password format for row ${index + 1}: ${row[2]}`);
        }

        const password = String(row[2]); // 將密碼轉換為字符串
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`Hashed password for row ${index + 1}:`, hashedPassword);
        let user = {
          name: row[0],
          email: row[1],
          password: hashedPassword,
          school: row[3],
          city: row[4],
        };

        users.push(user);
      } catch (err) {
        console.error(`Error processing row ${index + 1}:`, err.message);
        return res.status(400).send({
          message: `Error processing row ${index + 1}`,
          error: err.message,
        });
      }
    }

    console.log("Users to be created:", users);

    await User.bulkCreate(users)
      .then(async (createdUsers) => {
        console.log("Users successfully created. Total:", createdUsers.length);

        for (let i = 0; i < createdUsers.length; i++) {
          const profileData = {
            userId: createdUsers[i].dataValues.id,
            className: rows[i][5],
            studentId: rows[i][6] ? String(rows[i][6]) : null, // 確保是字串
            year: rows[i][7] ? String(rows[i][7]) : null,     // 確保是字串
            sex: rows[i][8],
          };

          console.log(`Profile data for row ${i + 1}:`, profileData);

          profiles.push(profileData);
        }

        console.log("Profiles to be created:", profiles);

        await Profile.bulkCreate(profiles)
          .then(async (createdProfiles) => {
            console.log("Profiles successfully created. Total:", createdProfiles.length);

            for (let i = 0; i < createdProfiles.length; i++) {
              await UserProfile.create({
                UserId: createdUsers[i].dataValues.id,
                ProfileId: createdProfiles[i].dataValues.id,
              });
              console.log(`UserProfile linked for User ID ${createdUsers[i].dataValues.id}`);
            }

            res.status(200).send({
              message: "批次註冊成功！" ,
            });
          })
          .catch((err) => {
            console.error("Error creating profiles:", err.message);
            res.status(400).send({
              message: "Error creating profiles",
              error: err.message,
            });
          });
      })
      .catch((err) => {
        console.error("Error creating users:", {
          message: err.message,
          stack: err.stack,
          users,
        });
        res.status(500).send({
          message: "資料匯入失敗，請檢查是否有重複註冊的問題!",
          error: err.message,
        });
      });
  } catch (error) {
    console.error("Batch registration error:", error.message);
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}`,
      error: error.message,
      stack: error.stack,
    });
  }
};

// Private function to validate email format
const getAuthorized = async (userId) => {
  const haveActivities = await Activity
      .findAll({
        where: {
          userId: userId
        }
      })
      .then((data) => { return { "haveActivities": data.map(element => element.id) }});
    
    // got user's activity joined
  const inRooms = await UserActivityGroup
    .findAll({
      where: {
        UserId: userId
      }
    }).then((data) => { return { "inRooms": data.map(element => element.ActivityGroupId) }});
    
  return {...haveActivities, ...inRooms}
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    //find a user by their email
    const user = await User.findOne({
      where: {
        email: email
      } 
    });

    
    if (!user) {
      return res.status(401).send("Authentication failed");
    }

    //if user email is found, compare password with bcrypt
    const isSame = await bcrypt.compare(password, user.password);
    // console.log('1')
    //if password is the same
      //generate token with the user's id and the secretKey in the env file

    if (!isSame) {
      return res.status(401).send("Authentication failed");
    }
    
    delete user.password;
    //got user's activity haved
    const authorizedInfo = await getAuthorized(user.id)

    let jwtPayload = {...user, ...authorizedInfo};
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    let token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: 1 * 24 * 60 * 60 * 1000,
    });

    // Set cookie with the token generated
    res.cookie("jwt", token, { 
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 天有效期
      httpOnly: true,                 // 禁止 JavaScript 訪問（防範 XSS 攻擊）
      secure: true,                   // 僅限 HTTPS 傳輸
      sameSite: "Strict"              // 防止 CSRF 攻擊
    });

    
    // Set cookie with the token generated
    // res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
    
    // add jwtToken
    const userWithoutPassword = { ...user.dataValues, jwtToken: token };

    
    
    // Send user details along with the token
    return res.status(200).send(userWithoutPassword);

  } catch (error) {
    res.status(500).send({
      message: "Could not log in process: " + error.toString(),
    });
  }
}

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    // const activity = req.query.activity;
    // var condition = activity ? { activity: { [Op.iLike]: `%${activity}%` } } : null;
  
    User.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
};

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    if (req.user.dataValues.id !== id) {
      return res.status(403).send("You are not authorized to access this resource.");
    }

    User.findByPk(id)
      .then(data => {
        if (data) {
          
          let userWithoutPassword = { ...data.dataValues};
          delete userWithoutPassword.password;
          res.send(userWithoutPassword);
        } else {
          res.status(404).send({
            message: `Cannot find user with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving user with id=" + id
        });
      });
};

// Update a User by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  if (req.user.dataValues.id !== id) {
    return res.status(403).send("You are not authorized to access this resource.");
  }

  try {
      // 從請求中提取新資料
      const { name, email, password } = req.body;

      // 根據 ID 查找使用者
      const user = await User.findByPk(id);
      if (!user) {
          return res.status(404).send({ message: `Cannot find user with id=${id}.` });
      }

      // 更新姓名與 Email
      if (name) user.name = name;
      if (email) user.email = email;

      // 如果有新密碼，對密碼進行加密
      if (password) {
          user.password = await bcrypt.hash(password, 10); // 加密新密碼
      }

      // 保存更新後的使用者資料
      await user.save();

      res.send({ message: "User was updated successfully." });
  } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).send({
          message: "Error updating user with id=" + id,
      });
  }
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete user with id=${id}. Maybe user was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete user with id=" + id
        });
      });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} users were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while removing all users."
        });
    });
};

// renew user
exports.reNewToken = async (req, res) => {
  if (!req.user) {
    return res.status(401).send("Authentication failed");
  }
  const userId = req.user.dataValues.id;
  
  //find a user by their email
  const user = await User.findOne({
    where: {
      id: userId
    } 
  });
  if (!user) {
    return res.status(401).send("Authentication failed");
  }


  delete user.password;
  const authorizedInfo = await getAuthorized(user.id)

  let jwtPayload = {...user, ...authorizedInfo};
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  let token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: 1 * 24 * 60 * 60 * 1000,
  });

  // add jwtToken
  const userWithoutPassword = { ...user.dataValues, jwtToken: token };
  
  // Set cookie with the token generated
  res.cookie("jwt", token, { 
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 天有效期
    httpOnly: true,                 // 禁止 JavaScript 訪問（防範 XSS 攻擊）
    secure: true,                   // 僅限 HTTPS 傳輸
    sameSite: "Strict"              // 防止 CSRF 攻擊
  });


  // Send user details along with the token
  return res.status(200).send(userWithoutPassword);
};