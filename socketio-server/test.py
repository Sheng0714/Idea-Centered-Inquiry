import asyncio
import json
import socketio

# standard Python
sio = socketio.SimpleClient()





# The main function that will handle connection and communication
# with the server
async def ws_client():
    print("WebSocket: Client Connected.")
    url = "https://inquiry.lazyinwork.com/"
    # Connect to the server
    async with socketio.AsyncSimpleClient(ssl_verify=False,engineio_logger=True) as sio:
        await sio.connect(url,socketio_path="s/socket.io/")

        # Send values to the server
        body = {
            "userId": "00001",
            "action": "test",
            "log": "200 GET \"something text\" 中文測試"
        }
        print(f"[OnGoing] Sending body to server: {body}")
        res1 = await sio.emit("health-check",json.dumps(body))
        print(f"[Success] Send body to server: {body}")
        print(f"[OnGoing] Getting body to server.")

        while True:
            event = await sio.receive()
            print(f'[Success]  Getting body to server: "{event[0]}" with arguments {event[1:]}')
            try:
                response = json.loads(event[1])
                print(f"[Success] Paser body to server.{response}")
                assert event[0] == 're-health-check', f"channal error: {event[0]}"
                assert response["userBody"] == body, f"response: {response}, response.userBody: {response['userBody']}"
                print(f"[ALL Success] response: {response}, response.userBody: {response['userBody']}")
                break
            except json.decoder.JSONDecodeError:
                print(f"[WARN] Paser body to server.{event[1]}")
            

 
# Start the connection
asyncio.run(ws_client())