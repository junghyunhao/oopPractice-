const ViewModel = class {
  // #을 붙여주면 private으로만들어주고 객체 내부에서만 접근 가능한 private 으로 만든다
  // symbol()로 지정해주어서 key값이 중복되지 않도록 한다.
  static #private = Symbol();
  //ViewModal.get()으로만 생성자 함수를 만들어 내기 위함이다.
  static get(data) {
    return new ViewModel(this.#private, data);
  }

  // binder에서 돌면서 넣어줄 값들을 설정해 준다.
  styles = {};
  attributes = {};
  properties = {};
  events = {};

  constructor(checker, data) {
    if (checker != ViewModel.#private) throw "use ViewModel.get()!";
    Object.entries(data).forEach(([k, v]) => {
      switch (k) {
        case "styles":
          this.styles = v;
          break;
        case "attributes":
          this.attributes = v;
          break;
        case "properties":
          this.properties = v;
          break;
        case "events":
          this.events = v;
          break;
        default:
          this[k] = v;
      }
    });
    Object.seal(this); // Value를 바꿀 순 있지만 Key를 추가할 순 없다.
  }
};

const BinderItem = class {
  el;
  viewmodel;
  constructor(el, viewmodel) {
    this.el = el;
    this.viewmodel = viewmodel;
    Object.freeze(this); // 아예 불변 객체로 만든다.
  }
};

const Binder = class {
  #items = new Set();
  add(v) {
    this.#items.add(v);
  }
  render(viewmodel) {
    this.#items.forEach((item) => {
      // 돌면서 아래 지정해준 객체에 client에서 넘겨줄 style, attibutes,properties,events값을 너허주어 적용해준다.
      const vm = viewmodel[item.viewmodel],
        el = item.el;
      Object.entries(vm.styles).forEach(([k, v]) => (el.style[k] = v));
      Object.entries(vm.attributes).forEach(([k, v]) => (el.attribute[k] = v));
      Object.entries(vm.properties).forEach(([k, v]) => (el[k] = v));
      Object.entries(vm.events).forEach(
        ([k, v]) => (el[`on${k}`] = (e) => v.call(el, e, viewmodel))
      );
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

const viewmodel = ViewModel.get({
  wrap: ViewModel.get({
    styles: { width: "50%", background: "#ffa", cursor: "pointer" },
  }),
  heading: ViewModel.get({
    properties: { innerHTML: "Title" },
  }),
  contents: ViewModel.get({
    properties: { innerHTML: "Contents" },
  }),
});

const scanner = new Scanner();
// const binder = scanner.scan(document.querySelector("#target"));

// 제어 역전

// template method 가 process이다 알고리즘들을 step by step인 객체화 한것 binder의 strategy함수를 객체화 한다
// 함수 ㅇㅔ _process이런식으로 기입하여 private이라는것을 명시

const Processor = class {
  cat;
  constructor(cat) {
    this.cat = cat;
    Object.freeze(this);
  }
  process(vm, el, k, v) {
    this._process(vm, el, k, v);
  }
  // 직접접근할 수 없도록 이렇게 만듬
  _process(vm, el, k, v) {
    throw "override";
  }
};

// Object.entries(vm.styles).forEach(([k, v]) => (el.style[k] = v));
// Object.entries(vm.attributes).forEach(([k, v]) => (el.attribute[k] = v));
// Object.entries(vm.properties).forEach(([k, v]) => (el[k] = v));
// Object.entries(vm.events).forEach(
//   ([k, v]) => (el[`on${k}`] = (e) => v.call(el, e, viewmodel))

// 익명 속성 클래스를 만들어서 하나씩 지정해주어 중복을 막고, 자식이 구현한걸 부모가 쓰게함
// Processor 를 상속받아 Processor로 인식한다
new (class extends Processor {
  _process(vm, el, k, v) {
    el.style[k] = v;
  }
})("styles");

new (class extends Processor {
  _process(vm, el, k, v) {
    el.attribute[k] = v;
  }
})("attributes");

new (class extends Processor {
  _process(vm, el, k, v) {
    [k] = v;
  }
})("properties");

new (class extends Processor {
  _process(vm, el, k, v) {
    el[`on${k}`] = (e) => v.call(el, e, viewmodel);
  }
})("events");

// 새로운 인스턴스에 _process만듬

// 외부에서 strategy를 공급받은 개조한 binder
const NewBinder = class {
  #items = new Set();
  #processors = {};
  add(v) {
    this.#items.add(v);
  }
  addProcessor(v) {
    // 값을쓰면 힘들어진다, symbol을 쓸수도 있음
    this.#processors[v.cat] = v;
  }
  render(v) {
    const processors = Object.entries(this.#processors);
    this.#items.forEach((item) => {
      const viewModel = [item.viewmodel],
        el = item.el;

      // processor에서 loop을 돌면서 hardcoding하던걸 추상화시킨 함수로 일반화 시킨다
      // processor와 계약한 내용으로 알고리즘을 고친다.
      // 공통로직을 묶고 객체로 빼고, 객체를 형으로빼고, 형으로 계약된내용으로 알고리즘 수정
      processors.forEach(([processorKey, processor]) => {
        Object.entries[
          viewModel[processorKey].forEach(([k, v]) => {
            processor.process(viewModel, el, k, v);
          })
        ];
      });
    });
  }
};

//   new (class extends Processor {
//     _process(vm, el, k, v) {
//       el.attribute[k] = v;
//     }
//   })("attributes");

//   new (class extends Processor {
//     _process(vm, el, k, v) {
//       [k] = v;
//     }
//   })("properties");

//   new (class extends Processor {
//     _process(vm, el, k, v) {
//       el[`on${k}`] = (e) => v.call(el, e, viewmodel);
//     }
//   })("events");
binder.addProcessor(
  new (class extends Processor {
    _process(vm, el, k, v) {
      el.style[k] = v;
    }
  })("styles")
);

// 1. 기존의 render에서 전략의 공통점을 찾아서, 상태와 관계를 찾아, class로뺀거를 수정한다

// observer, 객체의 특수한 method로 부르기
const ViewModelListener = class {
  viewModelUpdated(updated) {
    throw "override";
  }
};
