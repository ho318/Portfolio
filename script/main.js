let vidList = document.querySelector(".vidList");
let key = "AIzaSyB9y8GKf4q7lDT9EnFg9XUEkUFrJRwtG5U";
let playListId = "PLWMGy4BUlHrz1h1CaC4xZtkMsD2pvUp8g";

const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${key}&playlistId=${playListId}`;


fetch(url)
    .then((data) => {
        return data.json();
    })
    .then((json) => {
        let items = json.items;
        let result = '';
        items.map((el) => {

            let title = el.snippet.title;
            if(title.length > 20){
                title = title.substr(0, 20) + "...";
            }

            let des = el.snippet.description
            if(des.length > 100){
                des = des.substr(0, 100) + "...";
            }

            let date = el.snippet.publishedAt
            date = date.split("T")[0];
            // split은 (구분한 문자)를 기준으로 분할해서 배열로 반환, 반환된 배열에서 [2020.05.01, 9501041]

            result += `
                <article>
                    <a href="${el.snippet.resourceId.videoId}" class="pic">
                        <img src="${el.snippet.thumbnails.medium.url}">
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
        if(!e.target.closest("a")){
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
    vidList.addEventListener("click",(e)=>{
        const pop = vidList.querySelector(".pop");
        // pop이 존재하면 밑에 if문으로 코드를 시작하고 .. 없으면 무시되어 실행하지 않음
        if(pop){
            const close = pop.querySelector("span");

            if(e.target == close) pop.remove();
            // pop.remove(); 위에서 생성해놓고 바로 지우라고 해서 내 눈에는 안 보이지만 생성되고 지워진거임
        }
    })