const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Look for the "Authorization" header in the incoming request
  const authHeader = req.header('Authorization');

  // 2. If there is no header, kick them out immediately
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. No digital badge provided.' });
  }

  try {
    // 3. Extract the token (Remove the "Bearer " part)
    const token = authHeader.split(' ')[1];

    // 4. Verify the token using the EXACT SAME secret key we used in authRoutes.js
    const decoded = jwt.verify(token, 'teachbuddy_secret_key');

    // 5. Attach the decoded teacher ID to the request so the routes know exactly who is asking
    req.user = decoded; 
    
    // 6. Open the door! (Move on to the actual route)
    next(); 
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired digital badge.' });
  }
};