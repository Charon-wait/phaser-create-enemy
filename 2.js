var config = {
   type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 300 },
              debug: false
          }
      },
      scene: {
          preload: preload,
          create: create,
          update: update
      }
};

var game = new Phaser.Game(config);


var player;
var spider;;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var bomb;


function preload ()
{
	
      this.load.image('sky', 'assets/background.png');
      this.load.image('ground', 'assets/platform.png');
      this.load.image('star', 'assets/star.png');
      this.load.image('bomb', 'assets/bomb.png');
      this.load.spritesheet('dude', 
          'assets/dude.png',
          { frameWidth: 32, frameHeight: 48 }
      );
	 this.load.spritesheet('player',
	     'assets/player-1.png',
	     { frameWidth: 39, frameHeight: 48 }
	 ); 
	  
	this.load.spritesheet('spider', 'assets/spider.png', { frameWidth: 42, frameHeight: 32 });
	this.load.audio('jumpSmall', 'assets/space-blaster.mp3');
   this.load.audio('jumpSmall1', 'assets/sound.mp3');
}


function create ()
{


    this.add.image(400, 300, 'sky');
  bomb=this.add.image(400, 300, 'bomb');
   this.jumpSmallMusic = this.sound.add('jumpSmall');
    this.jumpSmallMusic1 = this.sound.add('jumpSmall1');
   
	   
	   platforms = this.physics.add.staticGroup();//这一句生成一个静态物理组（Group），并把这个组赋值给局部变量platforms
	   platforms.create(400, 568, 'ground').setScale(2).refreshBody();	   
	   platforms.create(600, 400, 'ground');
	   platforms.create(50, 250, 'ground');
	   platforms.create(750, 220, 'ground');
	   
	 //console.log(platforms); 
	   
	   
	   player = this.physics.add.sprite(100, 450, 'dude');
	   
	    player1 = this.physics.add.sprite(100, 450, 'player');
		this.physics.add.collider(player1, platforms);
	   
	   
	   
	  spider= this.physics.add.sprite(500, 10, 'spider');
	   bombs = this.physics.add.group();
	   
	   this.physics.add.collider(bombs, platforms);
	   this.physics.add.collider(spider, platforms);
	   this.physics.add.collider(player,bombs, hitBomb, null, this);
	   // player.setBounce(0.2);
	   //    spider.setBounce(0.2);

		
	
		
	   this.anims.create({
	       key: 'left',
	       frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
	       frameRate: 10,
	       repeat: -1
	   });
	   
	   
	   this.anims.create({
	       key: 'l',
	       frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
	       frameRate: 10,
	       repeat: -1
	   });
	
	   
	   this.anims.create({
	       key: 'turn',
	       frames: [ { key: 'dude', frame: 4 } ],
	       frameRate: 20
	   });
	   
	   this.anims.create({
	       key: 'turn1',
	       frames: [ { key: 'player', frame: 4 } ],
	       frameRate: 20
	   });
	   
	   this.anims.create({
	       key: 'right',
	       frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
	       frameRate: 10,
	       repeat: -1
	   });
	   this.anims.create({
	       key: 'r',
	       frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
	       frameRate: 10,
	       repeat: -1
	   });
	
	   
	   //player.setBounce(0.2);
	   player.setCollideWorldBounds(true);
	    spider.setCollideWorldBounds(true);
	   player.body.setGravityY(300);
	   
	   spider.body.setGravityY(300);
	   this.physics.add.collider(player, platforms);
	   //随机产生星星
	   cursors = this.input.keyboard.createCursorKeys();
	   stars = this.physics.add.group({
	       key: 'star',
	       repeat: 11,
	       setXY: { x: 12, y: 0, stepX: 70 }
	   });
	   
	   stars.children.iterate(function (child) {
	   
	    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
	   
	   });
	   this.physics.add.collider(stars, platforms);
	   //产生enemy
	   // spider = this.physics.add.group({
	   //     key: 'spider',
	   //     repeat: 2,
	   //     setXY: { x: 12, y: 0, stepX: 500 },
		  //   collideWorldBounds: true,
	   // });
	   
	   // spider.children.iterate(function (child) {
	   
	   //  child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
	   // tt();
	   // });
	   // this.physics.add.collider(spider, platforms);
	   var group = this.physics.add.group({
	             key: 'spider',
	             repeat: 2,
	             setXY: { x: 12, y: 0, stepX: 500 },
	           bounceX: 1,
	           collideWorldBounds: true,
			 
	       });
	   
	       group.setVelocityX(100, 10);
	this.physics.add.collider(platforms, group);
	//group.anims.play('r', true);
	   console.log()
	   //检测玩家是否与星星重叠：	   
	  this.physics.add.overlap(player, stars, collectStar, null, this);
	  //分数
	  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  
//console.log(player.left);


}

var speed=100;

function update ()
{
	
	
	// if (spider.x <800 && spider.body.velocity.x <= 0) {
	//   spider.setVelocityX(speed); // etc.
	// } else if (spider.x >25 && spider.body.velocity.x >= 0) {
	//   spider.setVelocityX(-speed); // etc.
	// }
	
	// if (spider.x < 400 && spider.body.velocity.x <= 0) {
	//   spider.setVelocityX(speed); // etc.
	// } else if (spider.x > 400 && spider.body.velocity.x >= 0) {
	//   spider.setVelocityX(-speed); // etc.
	// }
// if (spider.x>400 ) {
//   spider.anims.play('l', true);
//   spider.setVelocityX(-100);
//   console.log(spider.x);
// } 
//  if (spider.x <=21 ) {
//   spider.anims.play('r', true);
//   spider.setVelocityX(100);
//  console.log(spider.x)
// } 
	if (cursors.left.isDown)
	{
	    player.setVelocityX(-160);
	player1.setVelocityX(-160);
	    player.anims.play('left', true);
	  player1.anims.play('l', true);
	}
	else if (cursors.right.isDown)
	{
	    player.setVelocityX(160);
		player1.setVelocityX(160);
	    player.anims.play('right', true);
		player1.anims.play('r', true);
		  
	}
	else if (cursors.space.isDown) {
	console.log("bill");
	this.jumpSmallMusic.play({volume: 4});
	
	 } 
	else
	{
	    player.setVelocityX(0);
	
	    player.anims.play('turn');
		player1.setVelocityX(0);
			
		player1.anims.play('turn1');
	}
	
	if (cursors.up.isDown && player.body.touching.down)
	{
	    player.setVelocityY(-470);
	}
  
}

function tt(){
	
}



function collectStar (player, star)
{this.jumpSmallMusic.play({volume: 4});
    star.disableBody(true, true);
    
        score += 10;
        scoreText.setText('Score: ' + score);
    
        if (stars.countActive(true) === 0)
        {
            stars.children.iterate(function (child) {
    
                child.enableBody(true, child.x, 0, true, true);
    
            });
    
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    
        }
}

function hitBomb (player, bomb)
{
	this.jumpSmallMusic1.play({volume: 4});
    this.physics.pause();
    
        player.setTint(0xff0000);
    
        player.anims.play('turn');
    
        gameOver = true;
}