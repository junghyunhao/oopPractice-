interface Subject {
  registerObserver(o: Observer);
  removeObserver(o: Observer);
  notifyObservers();
}

interface Observer {
  update(temp: number);
}

class WeatherStation implements Subject {
  private temperature: number;
  private observers: Observer[] = [];

  setTemperature(temp: number) {
    console.log("new temp measurement " + temp);
    this.temperature = temp;
    this.notifyObservers();
  }

  registerObserver(o: Observer) {
    this.observers.push(o);
    throw new Error("Not implemented yet");
  }
  removeObserver(o: Observer) {
    const index = this.observers.indexOf(o);
    this.observers.splice(index, 1);
  }
  notifyObservers() {
    for (let observer of this.observers) {
      observer.update(this.temperature);
    }
  }
}

class TemperatureDisplay implements Observer {
  private subject: Subject;
  constructor(weatherStation: Subject) {
    this.subject = weatherStation;
    weatherStation.registerObserver(this);
  }
  public update(temp: number) {
    console.log("temp updated");
  }
}

class Fan implements Observer {
  private subject: Subject;
  constructor(weatherStation: Subject) {
    this.subject = weatherStation;
    weatherStation.registerObserver(this);
  }
  update(temp: number) {
    if (temp > 25) {
      console.log("fan : !!");
    } else console.log("fan : cool?");
  }
}

let weatherStation = new WeatherStation();

let tempDisplay = new TemperatureDisplay(weatherStation);
let fan = new Fan(weatherStation);
weatherStation.setTemperature(20);
weatherStation.setTemperature(30);
