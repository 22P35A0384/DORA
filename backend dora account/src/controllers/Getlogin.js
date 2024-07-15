import Userschema from '../models/newuser.js';
import bcrypt from 'bcryptjs';

const PostLogin = async (req, res, next) => {
    const { user: mail, pass } = req.body;
    let checkmail;
    let isPasswordCorrect;

    try {
        // Check if user exists
        checkmail = await Userschema.findOne({ email: mail });
    } catch (err) {
        console.error('Error finding user by email:', err);
        return res.status(500).json({ msg: 'Internal server error' });
    }

    if (!checkmail) {
        return res.status(200).json({ msg: 'Invalid User!' });
    }

    // Check if password is correct
    isPasswordCorrect = bcrypt.compareSync(pass, checkmail.password);
    if (!isPasswordCorrect) {
        return res.status(200).json(false);
    }
    return res.status(200).json(true);
};

export default PostLogin;
