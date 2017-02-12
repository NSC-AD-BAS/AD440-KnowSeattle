module.exports = function() {
    function Config(ip, port) {
        this.ip = ip;
        this.port = port;
    }
    
    function isCloud9() {
        return process && process.env && process.env.IP && process.env.PORT;
    }
    
    if (isCloud9()) {
        // if running in cloud9 environement then use its ip:port.
        return new Config(process.env.IP, process.env.PORT);
    } 
    
    // by default: bind server to all IPs and port 81.
    return new Config('81', '0.0.0.0');
}();