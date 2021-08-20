class Messenger {
  constructor(job) {
    this.job = job;
  }
}

class MsgBox {
    // 
  #item = new Set();
  static get(job) {
    return new MsgBox(this.#item, job);
  }
  jobList = [];
  constructor(job) {
    job.forEach((element) => {
      this.jobList = this.jobList.push(element);
    });
  }
}

class Scheduler {
  constructor() {}
  
}

class WorkerManager {
  constructor(mb, job) {
    this.worker = new Worker(mb, job);
    this.communicator = new WorkerCommunicator(mb);
  }

  do() {
    let currentWorker = this.worker;

    currentWorker = new Worker();
  }
}

class WorkerCommunicator {
  constructor() {}
}
class Worker {
  constructor() {}
  process (job) {
      this.plugIn = 
  }
}

class Processor {
  constructor() {
    this.pcb = pcb;
    this.iceMaker = iceMaker;
    this.payment = payment;
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


}

class IceMaker {

}

