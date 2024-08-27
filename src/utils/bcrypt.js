import bcrypt from 'bcrypt';

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidadPassword = (user, password) => bcrypt.compareSync(password, user.password);