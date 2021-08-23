enum Modules {
  PCB = "PCB", Payment = "Payment"


}

interface Instruction {
  type: 
}
interface JobList {
  jobId: string;
  instruction: Instruction[];
  timeStamp: timestamp;
}

class MsgBox {
  private jobType: string;
  private jobList: JobList;
  private observers: [];
  private job;
  constructor(jobType: string, job: JobList[]) {
    this.job = job;
    this.observers = [];
  }
  get(job) {
    return new MsgBox(this.jobType, job);
  }

  addObservers(o) {
    this.observers.push(o);
  }

  addMsgBox() {
    this.job.forEach((element) => {
      this.jobList = this.jobList.push(element);
    });
    this.notifyObservers();
  }

  notifyObservers() {
    for (let o of this.observers) {
      o.update(this);
    }
  }
}

class Messenger {
  private subject;
  constructor(msgBox) {
    this.subject = msgBox;
    msgBox.addObservers(this);
  }
  // write에 데이터가 들어오면 write 부분의 데이터를 확인하여 client에 report해주어야 한다.
  update(msgBox) {}
}

class WorkerCommunicator {
  private subject;
  constructor(msgBox) {
    this.subject = msgBox;
    msgBox.addObservers(this);
  } // 읽어서 있는거면, 바로 워커에게 넘겨줌, 넘겨주다가 해야한다.
  update(msgBox) {}
}
class Scheduler {
  private subject;
  constructor(msgBox) {
    this.subject = msgBox;
    msgBox.addObservers(this);
  }

  update(msgBox) {
    const sessionId = "random";
    const workerManager = new WorkerManager(sessionId, msgBox, job);
    return workerManager;
  }
}

const msgBox = new MsgBox();
const scheduler = new Scheduler();
const messenger = new Messenger();
const workerCommunicator = new WorkerCommunicator();

msgBox.addObservers(scheduler);
msgBox.addObservers(messenger);
msgBox.addObservers(workerCommunicator);

// msgBox.notifyObservers()

class WorkerManager {
  private processor;
  private communicator;

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
  constructor(type, job) {}
  process(type, job) {}
}

class Plugins {}
class PCB {
  constructor(mp, offset) {
    this.mp = mp;
    this.offset = offset;
  }
  extract() {
    const extract = new Plugins(mp, offset).extract();
    if (extract) {
    }
  }
}

class Payment {
  constructor() {}
}

class IceMaker {
  constructor() {}
}

class Indicator {
  constructor() {}
}
