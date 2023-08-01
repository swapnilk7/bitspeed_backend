# Live Server URL

    - https://bitspeed-backend.onrender.com
    
# Endpoint

    - /identify (POST request)
    - request body:
            {
	        "email"?: string,
	        "phoneNumber"?: number
            }

# Add .env config

- Create .env file and the following configuration
  - PORT = "YOUR_PORT_NUMBER"
  - MONGODB_URL = "YOUR_MONGO_URL"

# Run Backend

    - npm i
    - npm start
