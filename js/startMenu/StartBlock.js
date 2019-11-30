export class StartBlock{
  constructor(blockClass){
    this.blockClass = blockClass;
  }

  getHtml(){
    return `<ul class="start-menu ${this.blockClass}"></ul>`
  }
}