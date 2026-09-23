class Component {
  constructor(name, componentId, filePath, javascript, css) {
    this.name = name;
    this.filePath = filePath;
    this.css = css;
    this.javascript = javascript;
  }
  state = {"h": "h"};
  getName = () => {
    return this.name;
  }
  getState = () => {
    return this.state;
  }
  addToState = (key, value) => {
    this.state[key] = value;
  }
  getStateByKey = (key) => {
    return this.state[key];
  }
  changeStateByKey = (key, value) => {
    this.state[key] = value;
  }
  contains = (key) => {
    if (this.state[key]) {
      return true;
    }
    return false;
  }
  render = async (originQuery) => {
    await fetch(this.filePath)
    .then(res => res.text())
    .then(data => {
      const origin = document.querySelector(String(originQuery));
      if (origin) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        this.javascript.forEach(info => {
          const script = document.createElement('script');
          script.src = info.src;
          script.classList = `${this.name}-script`;
          if (info.isModue) script.type = "module";
          let scriptOrigin = info.inHead ? document.head : document.body;
          scriptOrigin.appendChild(script);
        });
        this.css.forEach(src => {
          const style = document.createElement('style');
          style.src = src;
          style.classList = `${this.name}-style`
          document.head.appendChild(script);
        });
        doc.querySelectorAll('*').forEach(e=>e.classList.add(`${this.name}`));
        origin.append(...doc.body.childNodes);
      } else {
        throw `error: ${originQuery} didn\`t found in this page`;
      }
    })
    .catch(err => {
      console.error(err);
    });
  }
  remove = () => {
    document.querySelectorAll(`${this.name}, ${this.name}-script, ${this.name}-style`).forEach(e => e.remove());
  };
}
