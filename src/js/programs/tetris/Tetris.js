import Shape from './Shape.js';

/*

= TODO =
- shape offsets & colors should be through Shape class
- bug where shapes 'get caught' at the edge of the board while rotating
- @ least add pause, speed up after certain score, something in UI for 'game over',  difficulty (see commented checkForRow method below)

*/

export class Tetris{

  constructor() {
   
    this.ctx = undefined;
    this.previewCtx = undefined;
    this.boardHeight = 18;
    this.boardWidth = 10;
    this.realBoardMatrix = this.getInitBoardMatrix();
    this.boardMatrix = this.getInitBoardMatrix();

    this.playerScore = 0;
    this.playerLines = 0;
    this.playerLevel = 1;
    this.lastLevelUp = 0;

    this.shape = new Shape();

    this.nextShape = this.preparePreviewShape();
    this.currentShape = this.shape.randomShape();
    this.currentShapeOffset = { x: 0 , y: 0 };
    this.dropCount= 0;
    this.interval = 1000;
    this.lastTime =0;

    this.gamePaused = false;
    this.gameOver = false;

    // will never be black
    this.shapeColours = ['black', '#F205CB','#0CB1F2','#5DD904','#F29F05','#F20505','#CD04D9','#ffffff'];
  }

  /*
  initCtx() can't be called until Tetris is in the DOM. See programUtil.js launchProgram()
  */

 cheat(){

  const shapes = Shape.getShapes();
  let theOneYouAlwaysWaitFor = shapes.filter( shape => shape.name === 'I');

  if(theOneYouAlwaysWaitFor.length !== 1 ) return;

  this.nextShape = theOneYouAlwaysWaitFor[0];
 
}
 
  // Called - Tetris onProgramOpen | content.js
  initCtx(){
    const canvas = document.getElementById('tetris');
    const ctx = canvas.getContext('2d');

    ctx.scale(40, 40);
    this.ctx = ctx;

    const previewCanvas = document.getElementById('previewCanvas');
    const previewCtx = previewCanvas.getContext('2d');

    previewCtx.scale(10, 10);
    this.previewCtx = previewCtx;

    this.init(); 
  }

  // Called launchProgram | programUtil.js
  getHtml(){
    return `
    <div class="tetris">

      <div class="tetris-left">

        <div class="tetris-info-box">
          <div class="tetris-game-info">
            <div class="tetris-score">
              <h2>Score:</h2>
              <p id="score">0</p>
            </div>
            <div class="tetris-level">
              <h2>Level:</h2>
              <p id="level">1</p>
            </div>
            <div class="tetris-lines">
              <h2>Lines:</h2>
              <p id="lines">0</p>
            </div>
          </div>
          <div class="tetris-shape-preview">
            <canvas  width="50px" height="50px" id="previewCanvas"></canvas>
          </div>
        </div>
       
      </div>

      <div class="tetris-canvas-wrap">
        <canvas id="tetris" width="400" height="720"></canvas>
      </div>

      <div class="tetris-right">
 
      </div>

    
    </div>
    `;
  }

  // Called onProgramClose() | content.js
  setGameOver(bool){
    this.gameOver = bool;
  }

  // Called onProgramClose() | content.js
  endGame(){
    this.currentShapeOffset.y = 18;
  }

  init(){
    
    this.drawCanvas();
    this.drawBoardMatrix();
    this.drawPreviewShape();
    this.drawCurrentShape();
    
    this.dropAtIntervals();
  }

  drawCurrentShape() {
   
      this.currentShape.matrix.forEach((row, y) => {
        row.forEach((val, x) => {
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

  drawPreviewShape() {
    this.previewCtx.clearRect(0, 0, 50, 50);
    this.nextShape.matrix.forEach((row, y) => {
      row.forEach((val, x) => {
        if( val !== 0 ){
          this.previewCtx.lineWidth = "0.05";
          this.previewCtx.strokeStyle = "#212121";
          this.previewCtx.strokeRect(x, y, 1,1);
       
          this.previewCtx.fillStyle = this.shapeColours[val];
          this.previewCtx.fillRect(x , y, 1, 1);
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

  // For all collisions...
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
          this.updatePlayerLines(1);
      }

      return acc;
  
      }, [])
      this.boardMatrix = updatedBoardMatrix;
  }

  checkLevelUp(){ 
    if((this.playerLines > 0) 
    && (this.playerLines !== this.lastLevelUp) 
    && (this.playerLines % 10 === 0)){

      this.playerLevel += 1;
      this.lastLevelUp += 10;

      document.getElementById('level').textContent = `${this.playerLevel}`;

      const oldInterval = this.interval;
      this.interval = oldInterval - 100;
     
    }
  }

  updatePlayerScore(score){
    this.playerScore += score;
    document.getElementById('score').textContent = this.playerScore;
  }

  updatePlayerLines(lines){
    this.playerLines += lines;
    document.getElementById('lines').textContent = this.playerLines;

    // Should work - lines updated one at a time
    this.checkLevelUp();
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

  // Check if shape touches the top
  checkGameOver(){ 
    if(this.boardMatrix[1][0] !== 0 || this.boardMatrix[1][1] !== 0 || this.boardMatrix[1][2] !== 0){
      this.gameOver = true;
    } 
  }

  togglePauseGame(){
    this.gamePaused = !this.gamePaused;
  }
  dropAtIntervals( t = 0 ) {
 
    let game;
    const currentInterval = t - this.lastTime;
    this.dropCount += currentInterval;

    if(this.dropCount > this.interval && !this.gamePaused){

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

  preparePreviewShape(){
    return this.shape.randomShape();
  }

  initNextShape(){
    this.currentShape = this.nextShape;
    this.currentShapeOffset = { x: 0 , y:0 };
    this.drawBoardMatrix();
    this.drawCurrentShape();

    this.nextShape = this.preparePreviewShape();
    this.drawPreviewShape();  
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
        
        if( this.isCollission() || this.gamePaused ){
          this.currentShapeOffset.x --;
        }
        
      },
      left: () => {
        this.currentShapeOffset.x --;
        
        if( this.isCollission() || this.gamePaused ){
          this.currentShapeOffset.x ++;
        }

      },
      down: () => {
        this.currentShapeOffset.y ++;

        if( this.isCollission() || this.gamePaused ){
          this.currentShapeOffset.y --;
        }

      },
      up: () => {
        if( this.isCollission() || this.gamePaused ) return;

        const rotatedCurrentShape = this.getRotatedCurrentShape();
        this.currentShape.matrix = [...rotatedCurrentShape];
  
      }
    }
 
  }

  // Matrix has to be square! ie 3x3, 4x4 etc
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