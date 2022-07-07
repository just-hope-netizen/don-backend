import User from '../models/user.js';
import CryptoJS from 'crypto-js';


export const updateUser = async (req, res) => {
    if (req.body.password) {
        let password = req.body.password;
        password = CryptoJS.AES.encrypt(JSON.stringify(
            req.body.password
        ),
            process.env.PASS_PHRASE
        ).toString(); //encryt password
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                //find in db and set
                $set: req.body,
            },
            {
                new: true,
            }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
}
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User account has been deleted');
    } catch (err) {
        res.status(500).json(err);
    }
}
// development ***
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc; //because of mongodb
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
}

// development ***
export const getUsers = async (req, res) => {
    const query = req.query.new;

    try {
        const users = query
            ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}


// development ***
export const stats = async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: '$createdAt' },
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
}