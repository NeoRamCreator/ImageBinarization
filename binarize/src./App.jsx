import './App.css';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Chart } from 'react-google-charts'
import { hot } from 'react-hot-loader/root';

function App() {
  const [executionTime, setExecutionTime] = useState(''); // не используется,тк предается объект с данными. пока не трогать
  const [indexImg, setIndexImg] = useState(0)

  function binarizeImage(imageElement, threshold) {


    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;


    // Средняя яркость изобрадения
    let totalBrightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      totalBrightness += avg;
    }
    const averageBrightness = totalBrightness / (data.length / 4);
    //

    const start = performance.now();

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;        // если сравнивать с средней яркостью изображения
      // const value = avg > threshold  ? 255 : 0;                   // если сравнивать с 50% цветности
      const value = avg > averageBrightness ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = value;
    }
    const end = performance.now(); // Записываем текущее время после окончания бинаризации
    const executionTime = end - start; // Вычисляем разницу

    ctx.putImageData(imageData, 0, 0);
    return { canvas, executionTime };
  }

  // не полню зачем, но пока пусть будет (может первый вариант?)
  // function displayImage(event) {
  //   const selectedImage = document.getElementById('selectedImage');
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();

  //     reader.onload = function (event) {
  //       selectedImage.src = event.target.result;
  //     }

  //     reader.readAsDataURL(file);
  //   }
  // }
  // function displayImage(event) {
  //   // const selectedImage = document.getElementById('selectedImage');
  //   const imgs = document.getElementById('imgs');
  //   const inputImg = document.createElement("img")
  //   console.log(event.target.files)

  //   const files = event.target.files;
  //   if (files) {
  //     for (let i in files) {
  //       // const file = event.target.files[i];
  //       const reader = new FileReader();

  //       reader.onload = function (event) {
  //         inputImg.src = event.target.result
  //         imgs.appendChild(inputImg)
  //         // selectedImage.src = event.target.result;
  //       }

  //       reader.readAsDataURL(i);
  //     }

  //   }
  // }

  function displayImage(event) {
    const imgs = document.getElementById('imgs');
    const files = event.target.files;


    if (files) {
      for (const file of files) {
        const reader = new FileReader();

        reader.onload = function (event) {
          const inputImg = document.createElement("img");
          inputImg.classList.add("inputImgItem");
          inputImg.width = 100
          // inputImg.height = 200 
          inputImg.src = event.target.result;
          imgs.appendChild(inputImg);
        }

        reader.readAsDataURL(file);
      }
    }
  }


  // кнопка бинаризации первый вариант для одного изображения
  // async function processImage() {
  //   // const selectedImage = document.getElementById('selectedImage');
  //   const outputCanvas = document.getElementById('outputCanvas');
  //   const inputImage = document.getElementById('imageInput');

  //   const thresholdValue = 128;


  //   // inputImage.forEach(element => {
  //   // console.log(inputImage.file.length)
  //   // });


  //   const file = inputImage.files[0];
  //   console.log("file. ", file)
  //   if (file) {
  //     // const forEachBin = () => {
  //     const reader = new FileReader();
  //     reader.onload = function (event) {
  //       const image = new Image();
  //       image.onload = function () {
  //         // const binarizedCanvas = await binarizeImage(selectedImage, thresholdValue);
  //         const binarizedCanvas = binarizeImage(image, thresholdValue);


  //         outputCanvas.width = binarizedCanvas.canvas.width;
  //         outputCanvas.height = binarizedCanvas.canvas.height;
  //         const ctx = outputCanvas.getContext('2d');
  //         ctx.drawImage(binarizedCanvas.canvas, 0, 0);

  //         // отрисовать бинаризированное изображение
  //         const binImage = document.getElementById('binImage'); 
  //         const dataURL = outputCanvas.toDataURL(); // Получаем изображение в формате data URL
  //         binImage.src = dataURL; // Устанавливаем data URL как источник изображения для <img>
  //         //

  //         //таблица 
  //         tableBuild(1, binarizedCanvas.canvas.width, binarizedCanvas.canvas.height, binarizedCanvas.executionTime.toFixed(3))
  //         //
  //         // outputCanvas.style.display = "none"
  //         // ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

  //         const timeElement = document.querySelector('.time');
  //         timeElement.textContent = binarizedCanvas.executionTime.toFixed(3);
  //       }
  //       image.src = event.target.result;

  //     }

  //     reader.readAsDataURL(file);
  //     // }
  //   }


  // }

  function processImage() {
    // кнопка бинаризации
    // const outputCanvas = document.createElement('canvas');
    const outputCanvas = document.getElementById('outputCanvas');
    const inputImages = document.getElementById('imageInput');
    const imgsBin = document.getElementById("imgsBin")
    const thresholdValue = 128;

    const files = inputImages.files

    let index = indexImg

    console.log("index: ", index)
    console.log("setIndexImg: ", index)

    if (files.length > 0) {
      setIndexImg(prev => prev + files.length)

      for (const inputImage of files) {

        console.log("indexImg, index: ", indexImg, index)
        const reader = new FileReader();
        reader.onload = function (event) {
          const image = new Image();
          image.onload = function () {
            const binarizedCanvas = binarizeImage(image, thresholdValue);

            outputCanvas.width = binarizedCanvas.canvas.width;
            outputCanvas.height = binarizedCanvas.canvas.height;

            const ctx = outputCanvas.getContext('2d');
            ctx.drawImage(binarizedCanvas.canvas, 0, 0);

            // отрисовать бинаризированное изображение
            // const binImage = document.getElementById('binImage'); 
            const imgElement = document.createElement('img')
            imgElement.width = 100
            // binImage.appendChild(imgElement)
            const dataURL = outputCanvas.toDataURL(); // Получаем изображение в формате data URL
            imgElement.src = dataURL; // Устанавливаем data URL как источник изображения для <img>
            // 
            imgsBin.appendChild(imgElement)

            //таблица 
            // tableBuild(++index, binarizedCanvas.canvas.width, binarizedCanvas.canvas.height, binarizedCanvas.executionTime)
            tableBuild(++index, binarizedCanvas.canvas.width, binarizedCanvas.canvas.height, binarizedCanvas.executionTime.toFixed(3))
            //
            const timeElement = document.querySelector('.time');
            // timeElement.textContent = binarizedCanvas.executionTime.toFixed(3);
          }

          image.src = event.target.result;

        }
        reader.readAsDataURL(inputImage);
      }

    }

    // setIndexImg(binBTN())
    console.log("setIndexImg(binBTN())", index)
    console.log("setIndexImg(binBTN())", indexImg)


  }


  const [data, setData] = useState([])

  const tableBuild = (index, width, height, time) => {
    const table = document.getElementById("table")

    // строка - новый HTML
    const newRowHTML = `
                          <tr>
                              <td>${index}</td>
                              <td>${width}</td>
                              <td>${height}</td>
                              <td>${width * height}</td>
                              <td>${time}</td>
                          </tr>
                        `;
    table.querySelector('tbody').innerHTML += newRowHTML;
    setData(prev => [...prev, [width * height, +time]])
    console.log(data)


  }

  const [showChart, setShowChart] = useState(false)

  // для отладки, не удалять
  useEffect(() => {
    console.log(data);
  }, [data]);


  const handleChart = (click) => {
    // setData(data.sort((a, b) => a[1] - b[1]))
    setShowChart(true)
    setData(prev => [["width*height", "time"], ...prev])

  }

  const inputFilesRef = useRef(null)



  return (
    <div className="container">
      <div>
        <div className="box">
          <input ref={inputFilesRef} multiple accept="image/*" type="file" id="imageInput" onChange={displayImage} />
          <br /><br />
          <div id='imgs'></div>
          <div id='imgsBin'></div>
          <button className='buttonBin' onClick={processImage}>Бинаризировать</button>
          <canvas id="outputCanvas" style={{ display: 'none' }}></canvas>

          {indexImg > 0 && (


            <table id='table' border="1">

              {/* <!-- Заголовок таблицы --> */}
              <caption>Время банаризации от количества покселей </caption>


              <thead>
                <tr>
                  <th>№</th>
                  <th>Ширина</th>
                  <th>Высота</th>
                  <th>количество пикселей</th>
                  <th>время бинаризации</th>
                </tr>
              </thead>


              <tbody>
              </tbody>

            </table>

          )}


          <div>


            {!showChart && (

              <button className='buttonChart' onClick={handleChart}>График</button>
            )}
            {showChart && (
              <div className='center'>
                <h2>График зависимости времени бинаризации от количества пикселей изображения</h2>
                <Chart
                  chartType="LineChart"
                  data={data}
                  options={{
                    title: 'График',
                    legend: "none",
                    width: 900,
                    height: 500,
                    pointSize: 5,
                    hAxis: {
                      title: 'количество пикселей изображения', // Название горизонтальной оси
                    },
                    vAxis: {
                      title: 'время бинаризации', // Название вертикальной оси
                    },
                    lineWidth: 0, // Здесь устанавливаем толщину линии

                  }}
                />
              </div>
            )}

          </div>
          {/* </div> */}

        </div>
      </div>
    </div>
    // <div className="container">
    //   <div>
    //   <div className="box">
    //     {/* <input multiple accept="image/*" type="file" id="imageInput" accept="image/*" onChange={displayImage} /> */}
    //     </div>
    //     {/* </div> */}
    //   </div>
    // </div>

    // {/* <img id="selectedImage" style={{ maxWidth: '500px' }} alt="" /> */}
    // {/* <img id="binImage" style={{ maxWidth: '200px' }} alt="" /> */}
    // {/* <br /><br />
    // <br /><br /> */}
    // {/* <canvas id="outputCanvas" style={{  }}></canvas> */}



  );
}

export default hot(App);

