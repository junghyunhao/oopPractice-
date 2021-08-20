const ViewModelListener = class {
  viewModelUpdated(updated) {
    throw "override";
  }
};

const ViewmodelValue = class {
  cat;
  k;
  v;
  constructor(cat, k, v) {
    this.cat = cat;
    this.k = k;
    this.v = v;
    Object.freeze(this);
  }
};

const ViewModelSubjec;

// subject이자 listener인 경우가 대부분
const ViewModel = class extends ViewModelListener {
  // #을 붙여주면 private으로만들어주고 객체 내부에서만 접근 가능한 private 으로 만든다
  // symbol()로 지정해주어서 key값이 중복되지 않도록 한다.
  static #private = Symbol();
  //ViewModal.get()으로만 생성자 함수를 만들어 내기 위함이다.
  static get(data) {
    return new ViewModel(this.#private, data);
  }
  static #subjects = new Set();
  static #inited = false;
  static notify(vm) {
    this.#subjects.add(vm);
    if (this.#inited) return;
    this.#inited = true;
    const f = () => {
      this.#subjects.forEach((vm) => {
        if (vm.#isUpdated.size) {
          vm.notify();
          vm.#isUpdated.clear();
        }
      });
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }

  // binder에서 돌면서 넣어줄 값들을 설정해 준다.
  styles = {};
  attributes = {};
  properties = {};
  events = {};
  #isUpdated = new Set();
  #listeners = new Set();
  subKey = "";
  parent = null;

  addListener(v) {
    this.#listeners.add(v);
  }

  removeListener(v) {
    this.#listeners.delete(v);
  }

  constructor(data) {
    super();
    Object.entries(data).forEach(([k, v]) => {
      if ("styles,attributes,properties".includes(k)) {
        this[k] = Object.defineProperties(
          v,
          Object.entries(obj).reduce((r, [k, v]) => {
            r[k] = {
              enumerable: true,
              get: (_) => v,
              set: (newV) => {
                v = newV;
                vm.#isUpdated.add();
              },
            };
            return r;
          }, {})
        );
      } else {
        Object.defineProperties(this, k, {
          enumerable: true,
          get: () => v,
          set: (newV) => {
            v = newV;
            // 자식이자 자기자신
            this.#isUpdated.add(new ViewModelValue(this.subKey, "", k, v));
          },
        });
        // 역참조할수있는 바인딩
        if (v instanceof ViewModel) {
          v.parent = this;
          v.subKey = k;
          // 자식의 listener가 된다
          v.addListener(this);
        }
      }
    });
    ViewModel.notify(this);
    Object.seal(this); // Value를 바꿀 순 있지만 Key를 추가할 순 없다.
  }

  viewmodelUpdated(updated) {
    updated.forEach((v) => this.#isUpdated.add(v));
  }
};

// template method 가 process이다 알고리즘들을 step by step인 객체화 한것 binder의 strategy함수를 객체화 한다
// 함수 ㅇㅔ _process이런식으로 기입하여 private이라는것을 명시

// const Processor = class {
//   cat;
//   constructor(cat) {
//     this.cat = cat;
//     Object.freeze(this);
//   }
//   process(vm, el, k, v) {
//     this._process(vm, el, k, v);
//   }
//   // 직접접근할 수 없도록 이렇게 만듬
//   _process(vm, el, k, v) {
//     throw "override";
//   }
// };

const BinderItem = class {
  el;
  viewmodel;
  constructor(el, viewmodel) {
    this.el = el;
    this.viewmodel = viewmodel;
    Object.freeze(this); // 아예 불변 객체로 만든다.
  }
};

// 외부에서 strategy를 공급받은 개조한 binder
const Binder = class extends ViewModelListener {
  #items = new Set();
  #processors = {};
  add(v) {
    this.#items.add(v);
  }
  addProcessor(v) {
    // 값을쓰면 힘들어진다, symbol을 쓸수도 있음
    this.#processors[v.cat] = v;
  }
  render(viewmodel) {
    const processors = Object.entries(this.#processors);
    this.#items.forEach((item) => {
      const vm = viewmodel[item.viewmodel],
        el = item.el;
      // processor에서 loop을 돌면서 hardcoding하던걸 추상화시킨 함수로 일반화 시킨다
      // processor와 계약한 내용으로 알고리즘을 고친다.
      // 공통로직을 묶고 객체로 빼고, 객체를 형으로빼고, 형으로 계약된내용으로 알고리즘 수정
      processors.forEach(([processorKey, processor]) => {
        // console.error([processorKey, processor]);
        Object.entries(vm[processorKey]).forEach(([k, v]) => {
          processor.process(viewmodel, el, k, v);
        });
      });
    });
  }
  watch(viewmodel) {
    // 이렇게하면 viewmodel에서 this가 되어서 최초 viewmodel일때는 render를 걸어준다.
    viewmodel.addListener(this);
    this.render(viewmodel);
  }
  unwatch(viewmodel) {
    viewmodel.removeListener(this);
  }
  viewModelUpdated(updated) {
    const items = {};
    this.#items.forEach((item) => {
      items[item.viewmodel] = [[item.viewmodel], item.el];
    });
    updated.forEach((v) => {
      // 모든 프로세스를 일반화 처리
      if (!items[v.subkey]) return;
      const [vm, el] = items[v.subKey],
        procesor = this.#processors[v.cat];
      if (!ell || !procesor) return;
      processor.process(vm, el, v.k, v.v);
    });
  }
};

const Scanner = class {
  scan(el) {
    //새로운 바인더를 생성해서 넣어준다
    const binder = new Binder();
    this.checkItem(binder, el);
    const stack = [el.firstElementChild];

    // HTML 전체에 대한 순회
    let target;
    while ((target = stack.pop())) {
      this.checkItem(binder, target);
      if (target.firstElementChild) stack.push(target.firstElementChild);
      if (target.nextElementSibling) stack.push(target.nextElementSibling);
    }
    return binder;
  }
  checkItem(binder, el) {
    const vm = el.getAttribute("data-vm");
    if (vm) binder.add(new BinderItem(el, vm));
  }
};

const scanner = new Scanner();
const binder = scanner.scan(document.querySelector("#target"));
binder.addProcessor(
  new (class extends Processor {
    _process(vm, el, k, v) {
      el.style[k] = v;
    }
  })("styles")
);

binder.addProcessor(
  new (class extends Processor {
    _process(vm, el, k, v) {
      el.attribute[k] = v;
    }
  })("attributes")
);

binder.addProcessor(
  new (class extends Processor {
    _process(vm, el, k, v) {
      el[`on${k}`] = (e) => v.call(el, e, viewmodel);
    }
  })("events")
);

binder.addProcessor(
  new (class extends Processor {
    _process(vm, el, k, v) {
      [k] = v;
    }
  })("properties")
);

// 새로운 인스턴스에 _process만듬

// 1. 기존의 render에서 전략의 공통점을 찾아서, 상태와 관계를 찾아, class로뺀거를 수정한다

// observer, 객체의 특수한 method로 부르기

//동적위임으로 해결.....

const getRandom = () => parseInt(Math.random() * 150) + 100;

const viewmodel2 = ViewModel.get({
  isStop: false,
  changeContents() {
    this.wrapper.styles.background = `rgb(${getRandom()},${getRandom()},${getRandom()})`;
    this.contents.properties.innerHTML = Math.random()
      .toString(16)
      .replace(".", "");
  },

  wrap: ViewModel.get({
    styles: { width: "50%", background: "#ffa", cursor: "pointer" },
    events: {
      click(e, vm) {
        vm.parent.isStop = true;
        console.log("clicked");
      },
    },
  }),
  heading: ViewModel.get({
    properties: { innerHTML: "Title" },
  }),
  contents: ViewModel.get({
    properties: { innerHTML: "Contents" },
  }),
});

// 제어 역전
binder.watch(viewmodel2);
const f = () => {
  viewmodel2.changeContents();
  if (!viewmodel2.isStop) {
    requestAnimationFrame(f);
  }
};
requestAnimationFrame(f);
