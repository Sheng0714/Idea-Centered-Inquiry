import React from 'react';
import AboutBackgroundImage from "../assets/undraw_moonlight_-5-ksn.svg";
import Navbar from "../components/Navbar_Student";

export default function About() {
  return (
    <div>
      <Navbar/>
    
    <div className="about-section-container">
            <div className="about-section-image-container">
              <img src={AboutBackgroundImage} alt="" style={{ marginTop: '-300px' }} />
            </div>
            <div className="about-section-text-container" style={{ marginTop: '-270px',marginLeft: '70px' }}>
                <p className="primary-subheading">about us</p>
                {/* <h1 className="primary-heading">
                CAWS—Collaborative Argument Writing System
                </h1> */}
                <p className="primary-text" style={{ fontSize: '24px' }}>
                CAWS is a groundbreaking collaborative writing platform designed to spark students' creativity and critical thinking. By seamlessly integrating AI technology with interactive learning modules, CAWS empowers students to effortlessly express their ideas, engage in discussions, and build compelling arguments. Whether in the classroom or through remote learning, CAWS helps students rapidly improve their writing skills, enhance their persuasive abilities, and boost their confidence. It’s not just a writing tool—it’s a platform that helps students become better communicators.
                </p>
                <div className="about-buttons-container">
                  {/* <button className="secondary-button">Learn More</button>
                  <button className="watch-video-button">
                    <BsFillPlayCircleFill /> Watch Video
                  </button> */}
                </div>
            </div>
        </div>
    </div>
  )
}