
// module.exports = (fn) => {
//     return (err , req , res) => {
//           Promise.resolve(fn(req , res , next)).catch(next);
//     };
// };

module.exports = (fn) => {
    return ( req , res , next) => fn(req , res , next).catch(next);
};