# MMM-UlsanBus
based MagicMirror Gyeonggi-Do Bus

Additional Module for MagicMirror² https://github.com/MichMich/MagicMirror

```
git clone https://github.com/seolsu/MMM-UlsanBus.git
cd MMM-UlsanBus
npm install
```

To use this module, add it to the modules array in the config/config.js file:

```
{
        module: "MMM-UlsanBus",
        position: "bottom_left",
        config: {
                apiBase: "http://openapi.its.ulsan.kr/UlsanAPI/getBusArrivalInfo.xo",
                serviceKey: "",
                stationId: 192024301, 
                header: "버스 도착 정보", //Header Title
                updateInterval: 1000*60*1/6, // 1 minute.
                },
},
```
