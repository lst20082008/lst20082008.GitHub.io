const rootComponent = {
    data() {
        return {
            todayTime: 0,
            todayMin: 0,
            totalTime: 0,
            arriveTime: "00:00",
            exitTime: "00:00",
            today: 0,
            map: new Map(),
            print: "",
            newToday: 0,
            newArriveTime: 0,
            newExitTime: 0
        }
    },
    mounted() {
        let today = new Date();
        this.today = today.getDate();
        if (localStorage.getItem('map')) {
            this.map = new Map(JSON.parse(localStorage.getItem('map')));
            console.log(this.map);
        }
        this.UpdateMap();
    },
    methods: {
        ClearTime() {
            this.map = new Map();
            this.UpdateMap();
        },
        CalculateTime(arriveTime, exitTime) {
            console.log("CalculateTime");
            let aH = Number.parseInt(arriveTime.split(':')[0]);
            let aM = Number.parseInt(arriveTime.split(':')[1]);
            let eH = Number.parseInt(exitTime.split(':')[0]);
            let eM = Number.parseInt(exitTime.split(':')[1]);
            let totalMin = 0;
            if (aH == 0 && aM == 0) {
                return 0;
            }
            if (eH < aH) {
                return 0;
            }
            if (eH == aH && eM <= aM) {
                return 0;
            }
            if (aH < 12) {
                if (eH < 12) {
                    totalMin = (eH - aH) * 60 + (eM - aM);
                } else {
                    totalMin =  (12 - aH) * 60 - aM;
                }
            }
            if (eH >= 14) {
                if ((eH < 17) || (eH == 17 && eM <= 30)) {
                    // exit before 17:30
                    if ((aH < 13) || (aH == 13 && aM <= 30)) {
                        totalMin += (eH - 13) * 60 + eM - 30;
                    } else {
                        totalMin += (eH - aH) * 60 + eM - aH;
                    }
                } else {
                    if ((aH < 13) || (aH == 13 && aM <= 30)) {
                        totalMin += (17 - 13) * 60 + 30 - 30;
                    } else {
                        totalMin += (17 - aH) * 60 + 30 - aH;
                    }
                    if (eH >= 18) {
                        // exit after 18:00
                        totalMin += (eH - 18) * 60 + eM;
                    }
                }
            }
            return totalMin;
        },
        UpdateMap() {
            console.log("map changed");
            localStorage.setItem("map", JSON.stringify(Array.from(this.map.entries())))
            console.log(this.map);
            let totalMin = 0;
            for (let value of this.map.values()) {
                console.log(value);
                totalMin += value;
            }
            this.totalTime = totalMin / 60;
        },
        Add() {
            this.map.set(this.newToday, this.CalculateTime(this.newArriveTime, this.newExitTime));
            this.UpdateMap()
        }
    },
    watch: {
        arriveTime(oldValue, newValue) {
            this.todayMin = this.CalculateTime(this.arriveTime, this.exitTime)
            this.todayTime = totalMin / 60;
            this.map.set(this.today, this.todayMin);
            this.UpdateMap()
        },
        exitTime(oldValue, newValue) {
            this.todayMin = this.CalculateTime(this.arriveTime, this.exitTime)
            this.todayTime = totalMin / 60;
            this.map.set(this.today, this.todayMin);
            this.UpdateMap()
        },
    }
}


const app = Vue.createApp(rootComponent)
const vm = app.mount('#app')