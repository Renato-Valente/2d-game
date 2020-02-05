const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.font = "50px Georgia";
ctx.fillStyle = "red";

const gravidade = 0.5;
const tela = {
    largura:1000,altura:800
}

//atributos dos obstaculos presentes no mapa   //os mais importantes:dx,dy,largura e altura
var pele = document.getElementById("chao");
var textura = {
    skin:[pele,pele,pele,pele,pele,pele,pele,pele,pele],
    sx:[96,96,96,96,96,96,96,96,96],
    sy:[64,64,64,64,64,64,64,64,64],
    swidht:[32,32,32,32,32,32,32,32,32],
    sheight:[32,32,32,32,32,32,32,32,32],
    dx:[30,50,150,200,350,1000,950,1000,1000],
    dy:[200,500,350,450,300,350,400,500,400],
    dwidht:[32,32,32,32,32,32,32,32,32],
    dheight:[32,32,32,32,32,32,32,32,32],
    largura:[200,1000,100,100,100,50,50,700,100],
    altura:[64,32,160,60,70,150,100,50,200]//sempre multiplos de 32

}
// atributo do personagem principal
var heroi = {
    altura: 48,largura:32,x:600,y:10,
    textura:document.getElementById("boneco"),
    framex:0,framey:0,vx:0,vy:0,
    andando:false,
    pulo:true,
    perdeu: false,
    ganhou:false

}

var camera = {
    x:400,y:300
}
var vilao = document.getElementById("inimigo");
var inimigo = {
    skin:[vilao,vilao],
    dx:[350,1160],
    dy:[450,450],
    framex:0,
    framey:[0,0],
    limite:[800,1600],
   inicio:[350,1160], 
   largura:[48,48],
   altura:[64,64],
   vx:[2,3]
}

var morango = {
    dx:[50,400,450,550,600,650,700,750,800,850,900,1300,1350,1400,1450,1500,1550,1250,1200],
    dy:[50,450,450,450,450,450,450,450,450,450,450,450 ,450 ,450 ,450 ,450 ,450 ,450 ,450 ],
    comeu:[false],
    x:0

}
//------------------------------------------------------------------------
//gameloop 
function game(){

    ctx.clearRect(0,0,tela.largura,tela.altura);
    heroi.x +=heroi.vx;
    heroi.y+=heroi.vy;
    
    ctx.translate(-heroi.x,-heroi.y);
    fisica();
    enemy();
    comida();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(heroi.textura,heroi.framex,heroi.framey,heroi.largura,
    heroi.altura,camera.x,camera.y,heroi.largura,heroi.altura);
    if(heroi.ganhou){
        ctx.font = "70px Georgia";
                    ctx.fillStyle = "green";
                    ctx.fillText("Voce ganhou",400,400);
    }
    if(heroi.perdeu){
        ctx.font = "70px Georgia";
        ctx.fillStyle = "black";
        ctx.fillText("Voce Perdeu",400,400);
    }
    ctx.fillText("Pontos: " + morango.x + "/" + morango.dx.length,50,50);
    bater();
    console.log(morango.x)
    
    
        if(!heroi.perdeu && !heroi.ganhou){
    requestAnimationFrame(game);
        }
}
//------------------------------------------------------------------------
//comandos para as ações do personagem
addEventListener("keydown",function(a){
   
    if(a.keyCode == 68){
        heroi.vx = 5;
        heroi.framey = 96;
        heroi.andando = true;
    }
    if(a.keyCode == 65){
        heroi.vx = -5;
        heroi.framey = 48;
        heroi.andando = true;
    }
    if (a.keyCode == 87 && heroi.pulo ){
        heroi.vy = -10;
        heroi.pulo = false;
    }
})

addEventListener("keyup",function(a){
   
    if(a.keyCode == 68 || a.keyCode == 65){
        heroi.vx = 0;
        heroi.andando = false;
    }
})

//--------------------------------------------------------------------------
//função que muda os frames dos personagens e da sensação de movimento

setInterval(function(){
    if(heroi.andando){
        heroi.framex+=32;
        if(heroi.framex>=128){
            heroi.framex = 0;
        }
        
    }
    inimigo.framex+=48;
    if(inimigo.framex>=192){
        inimigo.framex = 0;
    }
},200)

//------------------------------------------------------------------------
//funçao que desenha os obstaculos na tela 
//tambem aplica as leis da gravidade no personagem

function fisica(){
heroi.vy+=gravidade;
var cont = 0;
while(cont<textura.skin.length){
    
    x = textura.dx[cont];y = textura.dy[cont];
    while(y<textura.dy[cont]+textura.altura[cont]){
        x = textura.dx[cont]
    while(x<textura.dx[cont]+textura.largura[cont]){
    ctx.drawImage(textura.skin[cont],textura.sx[cont],textura.sy[cont],textura.swidht[cont],
    textura.sheight[cont],x,y,textura.dwidht[cont],textura.dheight[cont]);
    x+=textura.dwidht[cont];
    }
    y+=textura.dheight[cont];
}


    cont++;
}

}
//-------------------------------------------------------------------------------------------------
function bater(){ //nao deixa o personagem atravessar o chao ou o teto
    var cont = 0;
    var pode;
    while(cont<textura.skin.length){
        
        if(heroi.y+camera.y - heroi.vy>textura.dy[cont]+textura.altura[cont]){
            pode = true;
            
        }

        if(heroi.y+camera.y+heroi.altura<textura.dy[cont]+textura.altura[cont]){
            pode = false;
        }

        

        if(heroi.x+camera.x +(heroi.largura/2)>textura.dx[cont] &&
         heroi.x+camera.x<textura.dx[cont]+textura.largura[cont]+(heroi.largura/2)){
            
            if(heroi.y+camera.y + heroi.altura>textura.dy[cont] && heroi.y+camera.y<textura.dy[cont]+textura.altura[cont]){
                heroi.y = textura.dy[cont] - camera.y - heroi.altura;
                heroi.vy = 0;
                heroi.pulo = true;
            }
            
            if(pode && heroi.y+heroi.vy + camera.y<textura.dy[cont]+textura.altura[cont]){
                heroi.y = textura.dy[cont] - camera.y +textura.altura[cont]+1;
                heroi.vy = 0;
                
            }
            
        }//nao deixa o personagem atravessar as paredes
        if(heroi.y+camera.y+heroi.altura>textura.dy[cont] && 
            heroi.y+camera.y<textura.dy[cont]+textura.altura[cont] ){
                
                if(heroi.x+camera.x+heroi.vx+16>textura.dx[cont] && 
                    heroi.x+camera.x+heroi.vx<textura.dx[cont] + textura.largura[cont]+16){
                        heroi.x=heroi.x - heroi.vx;
                        
                    }
            }
            
        cont++;
    }
        
}

        
//---------------------------------------------------------------------------------------------------------------

function enemy(){
    var cont = 0;
    while(cont<inimigo.skin.length){
        ctx.drawImage(inimigo.skin[cont],inimigo.framex,inimigo.framey[cont],
            inimigo.largura[cont],inimigo.altura[cont],inimigo.dx[cont],inimigo.dy[cont],
            inimigo.largura[cont],inimigo.altura[cont]);
            if(inimigo.dx[cont]>inimigo.limite[cont]|| inimigo.dx[cont]<inimigo.inicio[cont]){
                inimigo.vx[cont] = inimigo.vx[cont]*(-1);
            }
            if(inimigo.vx[cont]>0){
                inimigo.framey[cont] = 128;
            }
            else{
                inimigo.framey[cont] = 64;
            }
            inimigo.dx[cont]+=inimigo.vx[cont];

            if(heroi.x+camera.x>inimigo.dx[cont] - 20 && heroi.x+camera.x+20<inimigo.dx[cont]+inimigo.largura[cont]){
                
                if(heroi.y+camera.y + heroi.altura>inimigo.dy[cont]&&
                    heroi.y+camera.y<inimigo.dy[cont]+inimigo.altura[cont]){
                        
                        heroi.perdeu = true;
                       
                    }

            }

            cont++
    }

}
//desenha os morangos na tela e detecta quando o jogador os coleta
function comida(){
    var cont = 0;
    while(cont<morango.dx.length){
        if(!morango.comeu[cont]){
        ctx.drawImage(document.getElementById("morango"),morango.dx[cont],morango.dy[cont],25,33);
        }
        
        if(heroi.x+camera.x>morango.dx[cont] && heroi.x+camera.x<morango.dx[cont]+30){
            
            if(heroi.y+camera.y + heroi.altura>morango.dy[cont] && heroi.y+camera.y<morango.dy[cont]+40
                && !morango.comeu[cont]){
                morango.comeu[cont] = true;
                morango.x++;
                if (morango.x>=morango.dx.length){
                    
                    heroi.ganhou = true;
                }
            }
        }

        cont++;
    }
}

//ctx.drawImage(heroi.textura,heroi.framex,heroi.framey,heroi.largura,
//heroi.altura,camera.x,camera.y,heroi.largura,heroi.altura);