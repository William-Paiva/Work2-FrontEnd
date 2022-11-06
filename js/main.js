var score = document.getElementsByClassName("score");
var classification;
function init() {
    return {
        brasil:{
            pts:0,
            pj:0,
            vit:0,
            emp:0,
            der:0,
            gm:0,
            gc:0,
            sg:0
        },
        servia:{
            pts:0,
            pj:0,
            vit:0,
            emp:0,
            der:0,
            gm:0,
            gc:0,
            sg:0
        },
        suica:{
            pts:0,
            pj:0,
            vit:0,
            emp:0,
            der:0,
            gm:0,
            gc:0,
            sg:0
        },
        camaroes:{
            pts:0,
            pj:0,
            vit:0,
            emp:0,
            der:0,
            gm:0,
            gc:0,
            sg:0
        }
    }
}
var matches={};

function pointsFor(match) {
    // { catar: { pts: 3, gm: x, gc: y, victory_delta: 0, 1, loss_delta: 0, 1, draw_delta: 0, 1 } }
    
    var a = match.team1.name;
    var b = match.team2.name;
    var a_sg = match.team1.sg;
    var b_sg = match.team2.sg;

    var result = {};
    result[a] = {
        pts: 0, gm: 0, gc: 0, victory_delta: 0, loss_delta: 0, draw_delta: 0
    }
    result[b] = {
        pts: 0, gm: 0, gc: 0, victory_delta: 0, loss_delta: 0, draw_delta: 0
    }

    result[a].gm = a_sg;
    result[b].gm = b_sg;
    
    result[a].gc = b_sg;
    result[b].gc = a_sg;
    
    if(a_sg > b_sg) {
        result[a].pts = 3;
        result[a].victory_delta = 1;
        
        result[b].pts = 0;
        result[b].loss_delta = 1;
    } else if(a_sg < b_sg) {
        result[a].pts = 0;
        result[a].loss_delta = 1;
        
        result[b].pts = 3;
        result[b].victory_delta = 1;
    } else {
        result[a].pts = 1;
        result[a].draw_delta = 1;
        
        result[b].pts = 1;
        result[b].draw_delta = 1;
    }

    return result;
}

function classificationTable(matches) {
    classification = init();
    
    for(var m in matches) {
        var tmp = pointsFor(matches[m]);
    
        for(var team in tmp) {
            classification[team].pts += tmp[team].pts;
            classification[team].gm += tmp[team].gm;
            classification[team].gc += tmp[team].gc;

            classification[team].vit += tmp[team].victory_delta;
            classification[team].der += tmp[team].loss_delta;
            classification[team].emp += tmp[team].draw_delta;

            classification[team].pj++;
            classification[team].sg += tmp[team].gm - tmp[team].gc;
        }
       
    }

    return classification;
}

for(i=0;i<score.length;i++){
    score[i].addEventListener("change",(s)=>{
        var team = s.target;
        var opponents = document.querySelectorAll("[data-match='"+team.dataset.match+"']");
        if(opponents[0].value!="" || opponents[1].value!=""){
            if(!matches[team.dataset.match]) {
                matches[team.dataset.match] = {
                    team1:{name:"",sg:0},
                    team2:{name:"",sg:0}
                }
            }
            matches[team.dataset.match][team.dataset.team].name=team.dataset.name;
            matches[team.dataset.match][team.dataset.team].sg=parseInt(team.value);
            // console.log(matches)
        }
        if(opponents[0].value!="" && opponents[1].value!=""){
            classificationTable(matches);
    // console.log(classification)
    refreshTable(classification);
        }
    });
}

function refreshTable(classification){
    // console.log(classification)
    //cria um array vazio que vai ser a lista ordenada
    var sorted=[];
    var group;
    Object.entries(classification).forEach((elements)=>{
        //cria um array vazio para preencher o sorted
        var toPush=[];
        //aloca os valores na tabela de classificação
        Object.entries(elements[1]).forEach((points)=>{
            // console.log(elements[0])
            document.getElementById(elements[0]+points[0]).textContent=points[1]
        })
        //(nome do time, pontos, saldo de gols, clone da tr)
        toPush.push(
            elements[0],
            elements[1].pts,
            elements[1].sg,
            document.getElementById(elements[0]).cloneNode(1)
        )
        group=document.getElementById(elements[0]).dataset.id;
        sorted.push(toPush)
    })
    //ordena a tabela pelos pontos ou saldo de gols
    sorted.sort((a,b)=>{
        if(a[1]>b[1]){
            return -1;
        }else if(a[1]==b[1]){
            if(a[2]>b[2]){
                return -1;
            }
        }
    })
    //insere as trs ordenadas na tabela de classificação
    document.getElementById(group).innerHTML="";
    sorted.forEach(refreshed => {
        document.getElementById(group).append(refreshed[3])
    });
    console.log(sorted)
}