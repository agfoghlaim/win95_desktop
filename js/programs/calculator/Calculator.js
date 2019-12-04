export class Calculator{
  constructor(){

    this.functions = [
      {name: 'plus', fn:'+'},
      {name: 'minus', fn:'-'},
      {name: 'multiply', fn:'*'},
      {name: 'divide', fn:'/'}
    ];

    // TODO - not really sure how % is supposed to behave
    this.win95Functions = [
      {name: 'sqrt', fn:'sqrt'},
      {name: '%', fn:'%'},
      {name: '', fn:''} 

      // "=" should have same classes as this.functions, hardcoded in CalcUI.showWin95Functions()
      // {name: 'equals', fn:'='} 
    ]

    this.numbers = [
      7,8,9,4,5,6,1,2,3,0,'.'
    ];

    this.state = {
      lhs: {ready: true, value: ''},
      rhs: {ready: false, value: ''},
      fn: {ready: false, value: ''}
    }

    this.lastin = {isFn:false, char:''};

    // CalcUI.showFunctions(this.functions);
    // CalcUI.showWin95Functions(this.win95Functions);
    // CalcUI.showNumbers(this.numbers);
    // CalcUI.showCancelButtons();
    // CalcUI.addListener(this);
  }

  initCalc(){
    
    CalcUI.showFunctions(this.functions);
    CalcUI.showWin95Functions(this.win95Functions);
    CalcUI.showNumbers(this.numbers);
    CalcUI.showCancelButtons();
    CalcUI.addListener(this);
  }

  getHtml(){
    return `
      <div class="cont calculator">
      <div class="calc-topsection">
          <span class="calc-menu">Edit</span>
          <span class="calc-menu">View</span>
          <span class="calc-menu">Help</span>
        </div>
        <div class="screenWrap">
            <div class="calc-screen">0</div>
        </div>

        <div class="calc-keys-wrap">
          <div class="mrkeys">
            <button class="button-95"></button>
            <button class="button-95"></button>
            <button class="button-95"></button>
            <button class="button-95"></button>
          </div>

          <div class="calc-cancel-btns"></div>
          <div class="calc-keys">
            <div class="calc-nokeys"></div> 
            <div class="calc-fnkeys"></div>
            <div class="calc-fancyKeys"></div> 
          </div>
        </div>
    </div>`;
  }
  updateLastIn(lastin){
    this.lastin = {isFn: lastin.isFn, char: lastin.char}
  }

  undoLast(){
   
    if(this.lastin.isFn){
      this.state.fn.value = '';
      this.state.fn.ready = true;
      this.state.rhs.ready = false;

    }else{
      if(this.state.lhs.ready){
        this.state.lhs.value = this.state.lhs.value.slice(0, -1);
      }else if(this.state.rhs.ready){
        this.state.rhs.value = this.state.rhs.value.slice(0, -1);
      }
    }
    CalcUI.updateScreen(this.getsides());
  }

  updateLhs(n){
    this.state.lhs.value += n;
  }

  updateRhs(n){
    this.state.rhs.value += n;
  }

  resetRhs(){
    this.state.rhs.value = '';
  }
  
  setFn(n){
    this.state.fn.value = n;
  }

  setLhs(n){
    this.state.lhs.value = n;
  }

  setRhs(n){
    this.state.rhs.value = n;
  }
  
  getsides(){
    return{
      lhs:this.state.lhs.value, rhs:this.state.rhs.value, fn:this.state.fn.value
    }
  }

  getready(){
    return{
      lhs: this.state.lhs.ready,
      rhs: this.state.rhs.ready,
      fn: this.state.fn.ready
    }
  }

  setready(lhs, fn, rhs){
    this.state.lhs.ready = lhs;
    this.state.fn.ready  = fn;
    this.state.rhs.ready = rhs;
  }

  // makes handleInputNo & handleInputFn easier to understand
  // maybe no need for all the bools since the calculator states have names now?
  ready(){
  
    let { lhs, fn, rhs } = this.getready();
    
    return{
      isAcceptingLhsOnly: () => (lhs && !fn && !rhs) ? true : false,
      isAcceptingRhsOnly: () => (!lhs && !fn && rhs) ? true : false,
      isAcceptingLhsAndFn: () => ( lhs && fn && !rhs ) ? true : false,
      isAcceptingFnOnly: () => ( !lhs && fn && !rhs  ) ? true : false,
      isAcceptingRhsAndFn: () => ( !lhs && fn && rhs ) ? true : false
    }
  }

  handleSqrt(){
    this.setFn('sqrt');
    this.setLhs( this.doCalculation() );
    this.setFn('');
    this.setready(false, true, false);
    CalcUI.updateScreen( this.getsides() );
  }

  // use rhs and calculate in place
  doCalculationInPlace(num){
    return{
      sqrt:() =>  this.updateInPlace( this.sqrt(num) ),
   
      percent:() => this.updateInPlace( this.percent() )
    }
  }

  updateInPlace( ans ){

    this.setRhs( ans );
    CalcUI.updateScreen( this.getsides() );

  }

  doCalculation(fn = this.state.fn.value, num){

    if(fn === '+') return this.add();
    if(fn === '-') return this.subtract();
    if(fn === '*') return this.multiply();
    if(fn === '/') return this.divide();
    if(fn === 'sqrt') return this.sqrt(num);
    if(fn === '%') return this.percent();
    if(fn === '=') return this.equals();
  }

  add(){
    return Number(this.state.lhs.value) + Number(this.state.rhs.value);
  }

  subtract(){
    return Number(this.state.lhs.value) - Number(this.state.rhs.value);
  }

  multiply(){
    return Number(this.state.lhs.value) * Number(this.state.rhs.value);
  }

  divide(){
    return Number(this.state.lhs.value) / Number(this.state.rhs.value);
  }

  sqrt(num = this.state.lhs.value){
    return Math.sqrt(Number(num));
  }

  percent(){
    return ((Number(this.state.lhs.value) / 100) * Number(this.state.rhs.value));
  }

  resetWithAns(ans){

    this.state.lhs.value = ans;
    if(this.state.fn.value === '='){
      this.state.fn.value = '';
    }
 
    this.state.rhs.value = '';
    this.setready(false, true, true);
   }

  handleInputNo(n){

    if( this.ready().isAcceptingFnOnly() ) return;

    else if ( this.ready().isAcceptingLhsOnly() ){
      this.updateLhs(n);
      this.setready(true, true, false);
    }
    
    else if ( this.ready().isAcceptingLhsAndFn() ){
      this.updateLhs(n); 
    }
    
    else if ( this.ready().isAcceptingRhsOnly() ){
      this.updateRhs(n);//and change fn
      this.setready(false, true, true);
    }
    
    else if( this.ready().isAcceptingRhsAndFn() ){
      this.updateRhs(n);
      this.setready(false, true, true); //check this, same as itself!
    }
    
    this.updateLastIn({isFn: false, char: n});
    CalcUI.updateScreen( this.getsides() );
  }

  handleInputFn(fnIn){

    if(fnIn === '') return;

    if( this.ready().isAcceptingLhsOnly() ) return;

    if( this.ready().isAcceptingRhsOnly() ) return;
    
    else if ( this.ready().isAcceptingLhsAndFn() ){
      this.handleIsAcceptingLhsAndFn(fnIn);
    }

    else if( this.ready().isAcceptingFnOnly() ){
      this.handleIsAcceptingFnOnly(fnIn);
    }
    
    else if ( this.ready().isAcceptingRhsAndFn() ){
      this.handleCalculation(fnIn)
    }
    
    else{
      // Maybe should be new Calculator() ?
      console.log("Something is wrong, sides were: ", this.getsides());
      return;
    }

    // update last in (for back btn and screen)
    this.handleUpdateLastIn(fnIn);

  }

  handleUpdateLastIn(fnIn){
    let sides = this.getsides();
    CalcUI.updateScreen(sides);
    this.updateLastIn( {isFn:true, char:fnIn} );
  }

  handleIsAcceptingFnOnly(fnIn){
 
    if(fnIn === '=' ) return;

    if(fnIn === 'sqrt'){
      this.handleSqrt(); //sets to F T F
      return;
    }
    this.setFn(fnIn);
    this.setready(false, false, true);
  }

  handleIsAcceptingLhsAndFn(fnIn){
    
    if(fnIn === '=') return;

    if(fnIn === 'sqrt'){
      this.handleSqrt(); //sets to F T F
      return;
    }
    this.setready(false, false, true);
    this.setFn(fnIn);
  }

  handleCalculation(fnIn){
    
    // sqrt in place on RHS
    if(fnIn === 'sqrt'){
      this.doCalculationInPlace( this.getsides().rhs ).sqrt();
      return;
    }

    // % in place on RHS
    if(fnIn === '%'){
      this.doCalculationInPlace().percent();
      return;
    }
    
    this.setLhs( this.doCalculation() );
    this.resetRhs();
    
    // set Fn unless '=' used to complete calculation
    if(fnIn === '='){
      this.setFn('');
      this.setready(false, true, false);
    }else{
      this.setFn(fnIn);
      this.setready(false, false, true);
    }
  }
}

export class CalcUI{

  static showFunctions(fns){
    const fnkeys = document.querySelector('.calc-fnkeys');
    let html = ``;

    fns.forEach( fn => {
      html += `<button class="button-95 fn fn-${fn.name}" value="${fn.fn}">${fn.fn}</button>`;
    }) 
    fnkeys.innerHTML = html;
  }

  // rearranged html for win95 version
  static showWin95Functions(fns){
    const fnkeys = document.querySelector('.calc-fancyKeys');
    let html = ``;

    fns.forEach( fn => {
      html += `<button class="button-95 fn fn-${fn.name}" value="${fn.fn}">${fn.fn}</button>`;
    }) 

    // and add '=' with same 'fn' classes
    html += `<button class="button-95 fn fn-equals" value="=">=</button>`;
    fnkeys.innerHTML = html;
  }

  static showNumbers(nos){
    const nokeys = document.querySelector('.calc-nokeys');
    let html = ``;

    nos.forEach( no => {
      html += `<button class="button-95 no no-${no}" value="${no}">${no}</button>`;
    }) 
    nokeys.innerHTML = html;
  }

  static showCancelButtons(){
    // TODO - CE and C are meant to do different things..?
    const html = `
    <button class="back button-95">Back</button>
    <button class="clear button-95">CE</button>
    <button class="clear button-95">C</button>`;

    document.querySelector('.calc-cancel-btns').innerHTML = html;
  }

  static updateScreen(sides){
    let { lhs, rhs, fn } = sides;
    //let screenString = `Left: ${lhs} Fn: ${fn} Rhs: ${rhs}`
    let screenString = `${lhs} ${fn} ${rhs}`;

    document.querySelector('.calc-screen').textContent = screenString;
  }

  static addListener(calc){
  
    const calculator = document.querySelector('.calculator');

    // use named non-arrow function because i need to take 'this' so listener can be removed below each time new Calculator() called
    calculator.addEventListener('click', function handler(e) {

      // number input
      if(e.target.classList.contains('no')){
        calc.handleInputNo(e.target.value)
        return;
      }
      
      // function input
      if(e.target.classList.contains('fn')){
        calc.handleInputFn(e.target.value);
        return;
      }
      
      // clear
      if(e.target.classList.contains('clear')){ 
        //this.removeEventListener('click', handler);

        calc = new Calculator();

        let sides = calc.getsides();

        CalcUI.updateScreen(sides);
        return;
      }
  
      // back button
      if(e.target.classList.contains('back')){
        calc.undoLast();
        return;
      }
  
    });
    
  }
//ui

}//end CalcUI