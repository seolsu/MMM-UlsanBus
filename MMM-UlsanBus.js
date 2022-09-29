/* Magic Mirror
 * Module: GyeonggiBus
 *
 * By Juil Kim
 * MIT Licensed.
 */
Module.register("MMM-UlsanBus", {
    requiresVersion: "2.12.0",
    default: {
        apiBase: "http://openapi.its.ulsan.kr/UlsanAPI/getBusArrivalInfo.xo",
        serviceKey: "",
        stationId: 192024301,
        //routeId: 236000222,
        header: "버스 도착 정보",
        updateInterval: 1000 * 60 * 2, // refresh every 2 minutes, minimum 10 seconds
    },

    getStyles: function() {
        return ["MMM-UlsanBus.css"]
    },

    getHeader: function() {
        if (this.busInfo) {
            return "<i class='fa fa-fw fa-bus'></i> " + this.config.header;
        }
        return "<i class='fa fa-fw fa-bus'></i> 버스 정보";
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.busInfo = [];
        var self = this
        this.loaded = false;
    },

	getDom: function() {
		var wrapper = document.createElement("div");

        if (!this.loaded) {
            wrapper.innerHTML = "Loading bus info...";
            return wrapper;
        }
        var busTable = document.createElement("table");
        busTable.className = "small";
        if(this.busInfo.length > 0) {
            for(var t in this.busInfo) {
                var bus = this.busInfo[t];
//                if(bus.routeId._text == this.config.routeId) {
                var row = document.createElement("tr");
                row.className = "title bright";
                busTable.appendChild(row);

		var ROUTENM = document.createElement("td");
		ROUTENM.innerHTML = bus.ROUTENM._text;
		row.appendChild(ROUTENM);

                var ARRIVALTIME = document.createElement("td");
                ARRIVALTIME.className = "arriving";
                ARRIVALTIME.innerHTML = parseInt(Number(bus.ARRIVALTIME._text)/60) + "분";
                row.appendChild(ARRIVALTIME);

                var PREVSTOPCNT = document.createElement("td");
                PREVSTOPCNT.innerHTML = bus.PREVSTOPCNT._text + "정류장";
                row.appendChild(PREVSTOPCNT);

/*                    var remainSeatCnt1 = document.createElement("td");
                    remainSeatCnt1.className = "light";
                    remainSeatCnt1.innerHTML = bus.remainSeatCnt1._text + "석";
                    row.appendChild(remainSeatCnt1);

                    if(bus.predictTime2.hasOwnProperty("_text")) {
                        var row2 = document.createElement("tr");
                        row2.className = "dimmed"
                        busTable.appendChild(row2);
    
                        var predictTime2 = document.createElement("td");
                        predictTime2.className = "arriving";
                        predictTime2.innerHTML = bus.predictTime2._text + "분";
                        row2.appendChild(predictTime2);

                        var locationNo2 = document.createElement("td");
                        locationNo2.innerHTML = bus.locationNo2._text + "정류장";
                        row2.appendChild(locationNo2);

                        var remainSeatCnt2 = document.createElement("td");
                        remainSeatCnt2.className = "light";
                        remainSeatCnt2.innerHTML = bus.remainSeatCnt2._text + "석";
                        row2.appendChild(remainSeatCnt2);
                    }
*/ //                }
            }
        }
        wrapper.appendChild(busTable);
		return wrapper;
	},

    getBusInfo: function() {
        Log.info("Requesting bus info");
        this.sendSocketNotification("GET_BUS_DATA",
            {
                "config": this.config,
                "identifier": this.identifier
            }
        )
    },

	notificationReceived: function(notification, payload, sender){
        switch (notification) {
            case "DOM_OBJECTS_CREATED":
                this.getBusInfo();
                var timer = setInterval(() => {
                        this.getBusInfo();
                }, this.config.updateInterval);
                break;
        }
	},

    socketNotificationReceived: function (notification, payload) {
        switch (notification) {
            case "BUS_DATA":
                this.loaded = true;
                console.log("NotificationReceived:" + notification);
                this.busInfo = payload;
                this.updateDom();
                break;
            case "BUS_DATA_ERROR":
                this.updateDom();
                break;
        }
    }    
})
