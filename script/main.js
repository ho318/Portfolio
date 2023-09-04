let vidList = document.querySelector(".vidList");
let key = "AIzaSyB9y8GKf4q7lDT9EnFg9XUEkUFrJRwtG5U";
let playListId = "PLWMGy4BUlHrz1h1CaC4xZtkMsD2pvUp8g";

const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${key}&playlistId=${playListId}`;


// ㅡㅡㅡㅡㅡㅡ youtube ㅡㅡㅡㅡㅡㅡㅡ
fetch(url)
    .then((data) => {
        return data.json();
    })
    .then((json) => {
        let items = json.items;
        let result = '';
        items.map((el, index) => {

            let title = el.snippet.title;
            if (title.length > 20) {
                title = title.substr(0, 20) + "...";
            }

            let des = el.snippet.description
            if (des.length > 100) {
                des = des.substr(0, 100) + "...";
            }

            let date = el.snippet.publishedAt
            date = date.split("T")[0];
            // split은 (구분한 문자)를 기준으로 분할해서 배열로 반환, 반환된 배열에서 [2020.05.01, 9501041]

            result += `
                <article>
                    <a href="${el.snippet.resourceId.videoId}" class="pic">
                        <img src="${el.snippet.thumbnails.maxres.url}">
                    </a>

                    <div class="con">
                        <h2>${title}</h2>
                        <p>${des}</p>
                        <span>${date}</span>
                    </div>
                </article>
                `;
        })
        vidList.innerHTML = result;
    })

// const vid = vidList.querySelector("article").querySelector("a");
// console.log(vid);
// 괄호 밖인 여기서는 a태그에 이벤트를 부여할 수가 없는 상황

// 그래서 이벤트 위임을 사용해서 a태그에 이벤트를 적용할거임
//a태그인 썸네일을 클릭하면 비디오가 팝업되서 보이게

vidList.addEventListener("click", (e) => {

    e.preventDefault();

    /* 이벤트 위임의 단점인 이벤트 범위가 커져서 부작용이 발생하는데 해결방안으로 
    이벤트 발생의 목표가 아니라면 return으로 방지하도록 */
    if (!e.target.closest("a")) {
        // 내가 클릭한 대상이 a태그가 아니라면 무시하라
        return;
    }


    const vidId = e.target.closest("article").querySelector("a").getAttribute("href");



    let pop = document.createElement("figure");
    pop.classList.add("pop");

    pop.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${vidId}" frameborder = "0" width="100%" height="100%" allowfullscreen></iframe>
            <span class="btnClose">close</span>
        `;
    vidList.append(pop);
});

// 팝업창의 close버튼도 동적으로 생성된 버튼으로 이벤트 위임을 통해서 구현해야 함
vidList.addEventListener("click", (e) => {
    const pop = vidList.querySelector(".pop");
    // pop이 존재하면 밑에 if문으로 코드를 시작하고 .. 없으면 무시되어 실행하지 않음
    if (pop) {
        const close = pop.querySelector("span");

        if (e.target == close) pop.remove();
        // pop.remove(); 위에서 생성해놓고 바로 지우라고 해서 내 눈에는 안 보이지만 생성되고 지워진거임
    }
})

// ㅡㅡㅡㅡㅡㅡㅡ main ㅡㅡㅡㅡㅡㅡㅡ

const frame = document.querySelector(".main");
const panels = frame.querySelectorAll(".panel li");


const len = panels.length - 1; //index의 값과 일치하도록 -1을 함
let num = 0;
let timer = null;
const interval = 5000; // 롤링 반복 시간

startRolling();



// 1. 롤링 시작기능
function startRolling () {

    active(num);
    // 언제나 1이 먼저 실행되고 2가 이후에 실행된다.
    // setInterval(()=>{}, 시간)
    // setInterval 콜백함수를 시간마다 계속 실행하도록 요청한다.
    // 단점 : 리소스 찌꺼기가 남는다.
    timer = setInterval(rolling, interval);

}


// 3. on클래스로인한 활성화 기능
function active (index) {
    // 클릭을 하는 순간 모든 panel과 btns들에 on을 일시적으로 지우고,
    // 클릭한 인덱스에 해당하는 panels인덱스와 btns인덱스에만 on을 붙인다.
    for (let el of panels) el.classList.remove("on");
    panels[index].classList.add("on");
    num = index;
    // 전역변수num을 active함수에서 함수가 실행되면서 변경된 index로
    // 전역변수num을 갱신하도록 한다.
} 

// 3-1 싱크를 맞추는 롤링함수
function rolling() {
    // 여기에서 전역변수num의 값과 len의 값을 비교해서 순환시켜준다.
    if(num < len) {
        num++;
    }else {
        num = 0;
    }
    active(num);
    // progress();

}
