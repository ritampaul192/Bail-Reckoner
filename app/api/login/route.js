import connectDB from './mongoose.js';
import Login from '../../model/schema.js';

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();
    const user = await Login.findOne({ emailAddress: email });
    if(!user){
      return new Response(
        JSON.stringify({ message: 'User not found. Cheak your Email or Sign up first' }),
        { status: 401 }
      );
    }
    else if (user.password !== password) {
      return new Response(
        JSON.stringify({ message: 'Password is not matched. Try again or try forgot-password' }),
        { status: 401 }
      );
    }

    const { userId, username, address, pinNumber, phoneNumber, emailAddress, anonymousUser } = user;

    return new Response(
      JSON.stringify({
        userId,
        username,
        anonymousUser,
        address,
        pinNumber,
        phoneNumber,
        emailAddress,
        message: 'Login successful',
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error('POST /login error:', err);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}