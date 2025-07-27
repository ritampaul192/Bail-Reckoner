export async function signupHandler(req, res) {
  try {
    // your signup logic here
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Server error while creating user.' },
      { status: 500 }
    );
  }
}