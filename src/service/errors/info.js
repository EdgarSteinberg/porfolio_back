
const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid,
    List of required properties: 
    * first_name: need to be a String, received ${user.first_name}
    * last_name: need to be a String, received ${user.last_name}
    * email: need to be a String, received ${user.email}
    * age: need to be a Number, received ${user.age}
    * password: need to be a String, received ${user.password}
    `;
}

export default generateUserErrorInfo;