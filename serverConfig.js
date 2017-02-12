module.exports = function() {
    function isCloud9() {
        return process && process.env;
    } 
    if (isCloud9()) {
        // if running in cloud9 environement then use its ip:port.
        return [process.env.PORT, process.env.IP];
    } 
    
    // by default: bind server to all IPs and port 81.
    return ['81', '0.0.0.0'];
}();