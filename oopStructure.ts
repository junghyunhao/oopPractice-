interface Instruction {

}
interface JobList {
jobId : string;
instruction: Instruction[]
}



class MsgBox {
  private jobType : string;
  private jobList : JobList;
  private observers : []
  private job
  constructor(jobType : string, job: JobList[] ) {
 this.job = job
    this.observers = []
  }
 get(job) {
    return new MsgBox(this.jobType, job);
  }

  addObservers (o) {
    this.observers.push(o)
  }

  addMsgBox () {
    this.job.forEach((element) => {
      this.jobList = this.jobList.push(element);
    });
    this.jobList.push(job)
    this.notifyObservers()
  }

  notifyObservers () {
    for(let o of this.observers) {
      o.update(this)
    } 
  }

}

class Messenger {
  private job
  constructor(job) {
    this.job = new MsgBox(job);
  }
  update() {

  }
}

class WorkerCommunicator {
  constructor() {}
  // 읽어서 있는거면, 바로 워커에게 넘겨줌 
}



const msgBox = new MsgBox()
const scheduler = new Scheduler()
const messenger = new Messenger()
const workerCommunicator = new WorkerCommunicator()

msgBox.addObservers(scheduler)
msgBox.addObservers(messenger)
msgBox.addObservers(workerCommunicator)

msgBox.notifyObservers()

class Scheduler {
  constructor() {
    const getMsgBox = 
  }
  
  update(msgBox) {
    const sessionId = "random"
    const workerManager = new WorkerManager(sessionId, msgBox, job)
    return workerManager
  }
}

class WorkerManager {
  private processor 
  private communicator 

  constructor(sessionId, mb, job) {
    this.processor = new Processor(mb, job);
    this.communicator = new WorkerCommunicator(mb);
  }

  do() {
    let currentWorker = this.processor;
    currentWorker = new Processor();
  }
}


class Processor {

  constructor(type, job) {

  }
  process (job) {
    this.plugIn = 
}
}

class PCB {
constructor(mp,offset) {
    this.mp = mp
    this.offset = offset
}
extract() {
const extract =  new Plugin(mp, offset).extract()
if(extract) {
    return true
}
}
}


class Payment {
  constructor(){

  }



}

class IceMaker {
  constructor(){

  }

}

class Indicator {
  constructor(){

  }
}

