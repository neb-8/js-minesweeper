let grid;
let spacing = 40;
let cols, rows;
let aknak=10;
let aktAkna=0;
let vege=false;

let flag;
let mine;
function preload() {
    flag = loadImage('flag2.png');
    mine = loadImage('mine2.png');
}

function setup(){
    createCanvas(400,400);
    cols = floor(width / spacing);
    rows = floor(height / spacing);
    x = cols / 2;
    y = rows / 2;
    background(170);
    halo();
    grid = make2DArray(cols, rows);
    aknazas();
    felderit();
    preload();
}


function draw(){
    strokeWeight(0);
}








//átalakítva tile-hoz
function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
        for(let j=0;j<rows;j++){
            arr[i][j] = new tile();
        }
    }
    return arr;
}

function halo(){
    for (var x = 0; x < width; x += width / 10) {
        for (var y = 0; y < height; y += height / 10) {
            stroke(0);
            strokeWeight(2);
            line(x, 0, x, height);
            line(0, y, width, y);
        }
    }
}

let vesztes=false;
//ide kell a felfedés
function mousePressed(){
    if(vege){
        return;
    }
    let cx=Math.floor(mouseX/spacing);
    let cy=Math.floor(mouseY/spacing);
    if(mouseButton===RIGHT&&!grid[cx][cy].felfedett){
        //zászlózás
        if(grid[cx][cy].zaszlo){
            grid[cx][cy].zaszlo=false;
            strokeWeight(2);
            fill(170);
            rect(cx*spacing,cy*spacing,spacing,spacing);
        }
        else{
            grid[cx][cy].zaszlo=true;
            image(flag,cx*spacing+5,cy*spacing+5,30,30);
        }
    }else{
        if(grid[cx][cy].akna&&!grid[cx][cy].zaszlo){
            //textSize(40);
            //text("¤",cx*spacing+10,cy*spacing+35);
            image(mine,cx*spacing+5,cy*spacing+5,30,30);


            vege=true;
            vesztes=true;
            noLoop();
        }
        if(!grid[cx][cy].akna){
            if(grid[cx][cy].mellett>0){
                grid[cx][cy].felfedett=true;
            }
            if(grid[cx][cy].mellett==0){
                felold(cx,cy);
            }
        }
    }

    let aknaCount=0;
    let zaszloCount=0;
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            if((grid[i][j].felfedett)&&(!grid[i][j].akna)&&(!grid[i][j].zaszlo)){
                textSize(40);
                strokeWeight(0);
                fill(255);
                rect(i*spacing,j*spacing,spacing,spacing);
                if(grid[i][j].mellett>0){
                    let szin = grid[i][j].mellett;
                    switch(szin){
                        case 1:
                            fill('green');
                            break;
                        case 2:
                            fill('blue');
                            break;
                        case 3:
                            fill('yellow');
                            break;
                        case 4:
                            fill('orange');
                            break;
                        case 5:
                            fill('blueviolet');
                            break;
                        case 6:
                            fill('brown');
                            break;
                        case 7:
                            fill('darkmagenta');
                            break;
                        case 8:
                            fill('red');
                            break;
                        default:
                            fill(0);
                            break;
                    }
                    text(grid[i][j].mellett,i*spacing+10,j*spacing+35);
                    fill(0);
                }
            }
            if(grid[i][j].zaszlo){
                zaszloCount++;
            }
            if(grid[i][j].akna&&grid[i][j].zaszlo){
                aknaCount++;
            }
        }
    }
    if((aknaCount==aktAkna)&&(zaszloCount==aknaCount)){
        vege=true;
        //console.log('nyertél!');
    }
    if(vege){
        if(vesztes){
            vesztett();
        }
        else{
            fill(200,200,200,125);
            rect(0,0,height,width);
            fill(0);
            text('nyertél!',100,100);
        }
    }
}

let a=0;
let b=0;
function mellette(a,b){
    let count=0;
    for(let i=-1;i<2;i++){
        for(let j=-1;j<2;j++){
            if((a+i>=0)&&(a+i<cols)&&(b+j>=0)&&(b+j<rows)){
                if(grid[a+i][b+j].akna){
                    count++;
                }
            }
        }
    }
    return count;
}

//rows cols talán cserére szorul
function felderit(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            grid[i][j].mellett=mellette(i,j);
        }
    }
}


function felold(a,b){
    for(let i=-1;i<2;i++){
        for(let j=-1;j<2;j++){
            if((a+i>=0)&&(a+i<cols)&&(b+j>=0)&&(b+j<rows)){
                if((!grid[a+i][b+j].akna)&&(grid[a+i][b+j].mellett!=0)&&(!grid[a+i][b+j].zaszlo)){
                    grid[a+i][b+j].felfedett=true;
                }
                else{
                    if((!grid[a+i][b+j].akna)&&(!grid[a+i][b+j].felfedett)&&(!grid[a+i][b+j].zaszlo)){
                        grid[a+i][b+j].felfedett=true;
                        felold(a+i,b+j);
                    }
                }
            }
        }
    }
}

function aknazas(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            let rand = random(100);
            if(rand<=aknak){
                grid[i][j].akna=true;
                aktAkna++;
            }
        }
    }
}

function vesztett(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            if(grid[i][j].akna){
                strokeWeight(2);
                fill(170);
                rect(i*spacing,j*spacing,spacing,spacing);
                image(mine,i*spacing+5,j*spacing+5,30,30);

            }
        }
    }
    strokeWeight(0);
    fill(200,200,200,125);
    rect(0,0,height,width);
    fill(0);
    textSize(40);
    text('vesztettél!',100,100);
}

let jaj=0;
function mouseClicked(){
    if(vege){
        jaj++;
    }
    if(jaj>1){
        location.reload();
        jaj=0;
    }
}