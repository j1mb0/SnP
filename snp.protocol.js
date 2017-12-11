
var snpProtocol  = {    // data message type
    PORT    : 4004,
    host    : 'h',      // time
    join    : 'j',      // no data
    ready   : 'r',      // time
    end     : 'e',      // time
    ping    : 'p',      // time
    update  : 'u',      // updates as json, seperated by '-', time, length of update array 
    correct : 'w',      // correction amount (like money)
    connect : 'c',      // server reply to client connection, containing their user id
    cmdSep  : '!',      // character that seperates commands from data
    dataSep : '.',      // character that seperates internal data
    // seperates the command from the data. 
    parseMsg : function(data){
        var commands = data.split(this.cmdSep);
        var msg = {
            command : commands[0],
            commanddata : commands[1] || null // some commands don't have data in them
        }
        return msg;
    },
    // for generic messages wiht only one data field
    createMsg : function(command, data){
        var packet = command + this.cmdSep + data;
        return packet;
    },
    // Make a snapshot of the current state, for updating the clients
    // all inputs must be strings - for example updates must be pre-jsonified
    // all inputs must not contain the data or command seperator characters
    createUpdateMsg : function(updates, time, length){
        var packet =  this.update + this.cmdSep;
        packet += updates + this.dataSep;
        packet += time + this.dataSep;
        packet += length;
        return packet;    
    },
    // seperates the data fields and returns the data 
    parseUpdateData : function(commandData){
        //Cut the message up into sub components
        var message_parts = commandData.split(this.dataSep);
        //The input commands come in like update-update-...-update
        // with a time stamp and a length of updates
        var msg = {
            updates : message_parts[0].split('-'),
            // the time gets its '.' replaced with '-' because '.' is the dataSep char
            time : message_parts[1].replace('-','.'),
            length : parseInt(message_parts[2])
        }
        return msg;
    } 
};

//server side we set the 'snpProtocol' class to a global type, so that it can use it anywhere.
if( 'undefined' != typeof global ) {
    module.exports = global.snpProtocol = snpProtocol;
}