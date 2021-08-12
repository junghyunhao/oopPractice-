interface Subject {
    registerObserver()
    removeObserver()
    notifyObserver()
}

interface Observer {
    update(temp:number)

}

class weatherStation {
    private temperature: number;
    setTemperature(temp: number) {
        console.log("new temp measurement "+ temp)
        this.temperature = temp
    }
}