import Shape from './Shape.js';

/*

= TODO =
- tetris modal & close listener removed when it's closed but keyboard listeners aren't... 
- shape offsets & colors should be through Shape class
- bug where shapes 'get caught' at the edge of the board while rotating
- some methods near bottom belong in tetrisUtil.js
- @ least add pause, speed up after certain score, something in UI for 'game over',  difficulty (see commented checkForRow method below)

*/


// down = 40
// right = 39
// left = 37
// up = 38

export class Tetris{

  constructor(ctx) {
   
    this.ctx = ctx;
    this.boardHeight = 18;
    this.boardWidth = 10;
    this.realBoardMatrix = this.getInitBoardMatrix();
    this.boardMatrix = this.getInitBoardMatrix();
    this.playerScore = 0;
    this.shape = new Shape();
    this.currentShape = this.shape.randomShape();
    this.currentShapeOffset = { x: 0 , y: 0 };
    this.dropCount= 0;
    this.interval = 1000;
    this.lastTime =0;

    this.gameOver = false;

    // will never be black
    this.shapeColours = ['black', '#F205CB','#0CB1F2','#5DD904','#F29F05','#F20505','#CD04D9','#ffffff'];

    this.init();
 
  }

  static getHtml(){
    return `
    <div class="tetris">
      <canvas id="tetris" width="400" height="720" style="border:2px solid pink"></canvas>

      <div class="score">
        <p id="score">0</p>
      </div>
    </div>
    `;
  }

  addKeyboardListeners(){
    
    const KEYCODES = [40, 39, 37, 38];
  
    document.addEventListener('keydown',  e => {
  
      if(! KEYCODES.includes(e.keyCode)) return;
      
      if(e.keyCode === 40 ){ 
        this.moveCurrentShape().down();
      }
  
      if(e.keyCode === 39 ){ 
        this.moveCurrentShape().right();
      }
  
      if(e.keyCode === 37 ){ 
        this.moveCurrentShape().left();
      }
  
      if(e.keyCode === 38 ){ 
        this.moveCurrentShape().up();
      }
  
    })
  }

  // see tetrisUtil.js
  setGameOver(bool){
    this.gameOver = bool;
  }

  // to end game, called when tetris modal is closed (see tetrisUtil.js)
  endGame(){
    this.currentShapeOffset.y = 18;
  }

  init(){
    this.drawCanvas();
    this.drawBoardMatrix();
    this.drawCurrentShape();
    this.dropAtIntervals();
  }

  drawCurrentShape() {
   
      this.currentShape.matrix.forEach((row, y) => {
        row.forEach((val, x) =>{
          if( val !== 0 ){
            this.ctx.lineWidth = "0.05";
            this.ctx.strokeStyle = "#212121";
            this.ctx.strokeRect(x + this.currentShapeOffset.x, y+ this.currentShapeOffset.y, 1,1);
         
            this.ctx.fillStyle = this.shapeColours[val];
            this.ctx.fillRect(x + this.currentShapeOffset.x, y+ this.currentShapeOffset.y, 1, 1);
     
          }
        })
      })
  }

  drawBoardMatrix() {

    this.drawCanvas();
    
    this.boardMatrix.forEach((row, y) => {
      row.forEach((val, x) =>{
        if( val !== 0 ){
     
          this.ctx.fillStyle = this.shapeColours[val];
          this.ctx.lineWidth = "0.05";
          this.ctx.strokeStyle = "#212121";
          this.ctx.strokeRect(x,y, 1,1);
          this.ctx.fillRect(x, y, 1, 1);

        }
      })
    })
  }

  // possibly some false positives?
  checkForRows(){

    const hasNoZeros = function(item){
      if(item.lastIndexOf(0) === -1){
        return true;
      }
      return false
    }
    let updatedBoardMatrix = this.boardMatrix.reduce((acc, row)=>{

      let fullRow = hasNoZeros(row)
      
      if(!fullRow){
        acc.push(row);
      }else{
          acc.unshift(this.returnArrayOfNumbers(this.boardWidth, 0));
          this.updatePlayerScore(10);
      }

      return acc;
  
      }, [])
      this.boardMatrix = updatedBoardMatrix;
  }

  updatePlayerScore(score){
    this.playerScore += score;
    document.getElementById('score').textContent = this.playerScore;

  }

  // This method of checking just filters full rows - leftovers dont drop
  // Keep and add option for 'difficulty

  // checkForRows(){
  
  //   this.boardMatrix.forEach((row, y)=>{
  //     let eachRow = row.filter( x => x !== 0 )
  //     if(eachRow.length === row.length){
  //       //fill with zeros
  //       row = row.fill(0,0,row.length);
  //       this.boardMatrix.pop()
  //       //want to remove it, 
  //       //replace all rows above with the one above that
  //       //add new to top
  //     }

  //   })
  // }

  drawCanvas(){
    this.ctx.fillStyle = '#212121';
    this.ctx.fillRect(0, 0, this.boardWidth, this.boardHeight);
  }

  checkGameOver(){ //touches the top?
    console.log("checking over")
    if(this.boardMatrix[1][0] !== 0 || this.boardMatrix[1][1] !== 0 || this.boardMatrix[1][2] !== 0){
      this.gameOver = true;
    } 
  }

  dropAtIntervals( t = 0 ) {
    let game;
    const currentInterval = t - this.lastTime;
    this.dropCount += currentInterval;

    if(this.dropCount > this.interval){

      this.currentShapeOffset.y ++;
      let isCollission = this.isCollission();
     
      if(isCollission === true){

        this.checkGameOver();
      
        if(this.gameOver){
          cancelAnimationFrame(game);
          return;
        }

        this.currentShapeOffset.y --;
        this.addShapeToBoardMatrix();
        this.checkForRows();
        this.initNextShape();
      }

      this.dropCount = 0;
    }
    this.lastTime = t;
    
    //draw
    this.drawBoardMatrix();
    this.drawCurrentShape();

   game = requestAnimationFrame((t)=>{this.dropAtIntervals(t)})
  }

  initNextShape(){
    this.currentShape =  this.shape.randomShape();
    this.currentShapeOffset = { x: 0 , y:0 };
    this.drawBoardMatrix();
    this.drawCurrentShape();
  }

  isCollission(){
    const m = this.currentShape.matrix;
    const o = this.currentShapeOffset;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (this.boardMatrix[y + o.y] &&
                this.boardMatrix[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
  }
 
  moveCurrentShape() {
    return {
      right: () => {
        this.currentShapeOffset.x ++;
        
        if( this.isCollission() ){
          this.currentShapeOffset.x --;
        }
        
      },
      left: () => {
        this.currentShapeOffset.x --;
        
        if( this.isCollission() ){
          this.currentShapeOffset.x ++;
        }

      },
      down: () => {
        this.currentShapeOffset.y ++;

        if( this.isCollission() ){
          this.currentShapeOffset.y --;
        }

      },
      up: () => {
        if( this.isCollission() ) return;

        const rotatedCurrentShape = this.getRotatedCurrentShape();
        this.currentShape.matrix = [...rotatedCurrentShape];
  
      }
    }
 
  }

  // matrix has to be square! ie 3x3, 4x4 etc
  getRotatedCurrentShape() {

    let t = this.currentShape.matrix;
    
    t = t.reduce((acc, cur , i, matrix)=>{

      let a = [];

      matrix.forEach( row => a.unshift(row[i]) );

      acc.push(a);

      return acc;

    }, []);

    return t;
  }

  addShapeToBoardMatrix() {
    this.currentShape.matrix.forEach((row, y) => {
      row.forEach((val, x) =>{
        if(val !== 0 ){
          this.boardMatrix[y + this.currentShapeOffset.y][x+this.currentShapeOffset.x] = val;
        }
      })
    });
  }

  getInitBoardMatrix() {
    const initBoardMatrix = [];
    for(let i = 0; i < this.boardHeight;i++){
      initBoardMatrix.push(this.returnArrayOfNumbers(this.boardWidth, 0))
    }
    return initBoardMatrix;
  }

  getBoardMatrix() {
    return this.boardMatrix;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
  }

  returnArrayOfNumbers(numNos, no) {
    let ones = [];
    for(let i = 0; i < numNos; i++ ){
      ones.push(no);
    }
    return ones;
  }

  checkIfBottomRowIsInvisible() {
    let length = this.currentShape.matrix[0].length;
    let copyLastRow = JSON.parse(JSON.stringify(this.currentShape.matrix[length -1] ));
   
    if(JSON.stringify(copyLastRow) === JSON.stringify(copyLastRow.fill(0, 0 , length))){
     // console.log("check edge case");
      return true;
    }
    return false;
  }

}