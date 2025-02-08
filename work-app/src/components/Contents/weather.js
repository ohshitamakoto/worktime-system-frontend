//天気予報
export const GetWeatherNewsS = () => {
    var tenkiURL = "https://www.jma.go.jp/bosai/forecast/data/forecast/040000.json";
    var tenki = "";
    var kion_pm = "";
    var fuga;

    return new Promise((resolve, reject) => {
        fetch(tenkiURL)
            .then((res) => res.json())
            .then((data) => {
            fuga = "【仙台】";
            tenki = data[0].timeSeries[0].areas[0].weathers[0];
            tenki = tenki.replaceAll(/\s+/g, '');
            kion_pm = data[0].timeSeries[2].areas[0].temps[1];
            fuga = fuga + tenki + "　最高" + kion_pm +"℃     ";
            fuga = fuga.replace( /晴れ/g, "☀" );
            fuga = fuga.replace( /くもり/g, "☁" );
            fuga = fuga.replace( /雨/g, "☂" );
            resolve(fuga)
            })
            .catch(() => alert("error"));
        });
};

export const GetWeatherNewsK = () => {
    var tenkiURL = "https://www.jma.go.jp/bosai/forecast/data/forecast/170000.json";
    var tenki = "";
    var kion_pm = "";
    var fuga;

    return new Promise((resolve, reject) => {
        fetch(tenkiURL)
            .then((res) => res.json())
            .then((data) => {
            fuga = "【金沢】";
            tenki = data[0].timeSeries[0].areas[1].weathers[0];
            tenki = tenki.replaceAll(/\s+/g, '');
            kion_pm = data[0].timeSeries[2].areas[0].temps[1];
            fuga = fuga + tenki + "　最高" + kion_pm +"℃     ";
            fuga = fuga.replace( /晴れ/g, "☀" );
            fuga = fuga.replace( /くもり/g, "☁" );
            fuga = fuga.replace( /雨/g, "☂" );
            resolve(fuga)
            })
            .catch(() => alert("error"));
        });
};

export const GetWeatherNewsH = () => {
    var tenkiURL = "https://www.jma.go.jp/bosai/forecast/data/forecast/220000.json";
    var tenki = "";
    var kion_pm = "";
    var fuga;

    return new Promise((resolve, reject) => {
        fetch(tenkiURL)
            .then((res) => res.json())
            .then((data) => {
            fuga = "【浜松】";
            tenki = data[0].timeSeries[0].areas[1].weathers[0];
            tenki = tenki.replaceAll(/\s+/g, '');
            kion_pm = data[0].timeSeries[2].areas[1].temps[1];
            fuga = fuga + tenki + "　最高" + kion_pm +"℃     ";
            fuga = fuga.replace( /晴れ/g, "☀" );
            fuga = fuga.replace( /くもり/g, "☁" );
            fuga = fuga.replace( /雨/g, "☂" );
            resolve(fuga)
            })
            .catch(() => alert("error"));
        });
};


export const GetMessage = () => {
    var tenkiURL = process.env.REACT_APP_BACKEND_URL + "/content";
    var fuga;

    return new Promise((resolve, reject) => {
        fetch(tenkiURL)
            .then((res) => res.json())
            .then((data) => {
            fuga = data[0].msg;
            resolve(fuga)
            })
            .catch(() => alert("error"));
        });
};

export const GetWeatherState = () => {
    var tenkiURL = process.env.REACT_APP_BACKEND_URL + "/content";
    var fuga;

    return new Promise((resolve, reject) => {
        fetch(tenkiURL)
            .then((res) => res.json())
            .then((data) => {
            fuga = data[0].tenki;
            resolve(fuga)
            })
            .catch(() => alert("error"));
        });
};