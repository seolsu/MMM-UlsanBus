const NodeHelper = require("node_helper");
const convert = require('xml-js');
const request = require('request');

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        switch (notification) {
            case "GET_BUS_DATA":
                let self = this;
                self.getData(payload);
                break;
        }
    },

    getData: async function (payload) {
        let self = this;
        var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + payload.config.serviceKey; /* Service Key*/
        queryParams += '&' + encodeURIComponent('stopid') + '=' + encodeURIComponent(payload.config.stationId); /* */
        var url = payload.config.apiBase + queryParams;
        request({
            url: url,
            method: 'GET'
        }, function (error, tableInfo, body) {
            if(!error & tableInfo.statusCode == 200){
                var result = convert.xml2json(body, { compact: true, spaces: 4 });
                var data = JSON.parse(result).tableInfo
                if(data.hasOwnProperty("list") && Array.isArray(data.list.row)){
                    var row = data.list.row;
                    self.sendSocketNotification("BUS_DATA", row);
                } else {
                    self.sendSocketNotification("BUS_DATA_ERROR", data);
                }
            }
        });
    },


});
