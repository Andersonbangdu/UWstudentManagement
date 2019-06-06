var menuList = document.getElementById("menu-list");
var tbody = document.getElementById("tableBody");
var model = document.getElementById("model");
var tableData = [];
function bindEvent() {
  console.log(menuList);
  menuList.addEventListener("click", changeMenu, false);
  var submitBtn = document.getElementById("addStudentBtn");
  submitBtn.addEventListener("click", submitStudent, false);
  tbody.addEventListener("click", clickTable, false);
  var editSubmit = document.getElementById("editSubmitBtn");
  editSubmit.addEventListener("click", editStudentSubmit, false);
  var mask = document.getElementById("mask");
  mask.onclick = function(e) {
    model.style.display = "none";
  };
}
// Edit n Del
function clickTable(e) {
  console.log(e);
  var tagName = e.target.tagName;
  if (tagName != "BUTTON") {
    return false;
  }
  var isEdit = [].slice.call(e.target.classList).indexOf("edit") > -1;
  if (isEdit) {
    var index = e.target.getAttribute("data-index");
    editStudent(tableData[index]);
  } else {
    var index = e.target.getAttribute("data-index");
    var isDel = window.confirm("Are you sure to delete?");
    if (isDel) {
      transferData(
        "/api/student/delBySno",
        {
          sNo: tableData[index].sNo
        },
        function(result) {
          alert("Student has been delete!");
          getTableData();
        }
      );
    }
  }
}
function editStudent(data) {
  model.style.display = "block";
  renderEditForm(data);
}

// Rendering form data
function renderEditForm(data) {
  var editForm = document.getElementById("editForm");
  for (var prop in data) {
    if (editForm[prop]) {
      editForm[prop].value = data[prop];
    }
  }
}

// Get Form Data
function getFormData(form) {
  var name = form.name.value;
  var sex = form.sex.value;
  var sid = form.sid.value;
  var email = form.email.value;
  var dob = form.dob.value;
  var tel = form.tel.value;
  var address = form.address.value;
  var studentObj = {
    name: name,
    sex: sex,
    phone: tel,
    email: email,
    birth: dob,
    address: address,
    sNo: sid,
    appkey: "d913084825_1559419618338"
  };
  if (!sid || !name || !tel || !dob || !sex || !address || !email) {
    alert("Please fill out all the information!");
    return false;
  }
  return studentObj;
}

// Edit Submit
function editStudentSubmit(e) {
  e.preventDefault();
  var editForm = document.getElementById("editForm");
  var studentObj = getFormData(editForm);
  if (!studentObj) {
    return false;
  } else {
    transferData("/api/student/updateStudent", studentObj, function(result) {
      alert("Everything is up to date!");
      // editform.reset();
      getTableData();
      var mask = document.getElementsByClassName("mask")[0];
      mask.click();
      // var studentListDom = menuList.getElementsByTagName("dd")[0];
      // studentListDom.click();
    });
  }
}

function changeMenu(e) {
  console.log(e.target);
  var tagName = e.target.tagName;
  if (tagName != "DD") {
    return false;
  }
  //   Picking Left Nav
  var dd = this.getElementsByTagName("dd");
  //   Deactive Class name
  for (var i = 0; i < dd.length; i++) {
    dd[i].classList.remove("active");
  }
  //   Active Tag
  e.target.classList.add("active");
  var id = e.target.getAttribute("data-id");
  var content = document.getElementById(id);
  var contentActive = document.getElementsByClassName("content-active");
  for (var i = 0; i < contentActive.length; i++) {
    contentActive[i].classList.remove("content-active");
  }
  content.classList.add("content-active");
  if (id == "studentList") {
    getTableData();
  }
}
// Getting Data from DB Api
function getTableData() {
  var result = saveData("http://api.duyiedu.com/api/student/findAll", {
    appkey: "d913084825_1559419618338"
  });
  transferData("/api/student/findAll", {}, function(result) {
    console.log(result);
    tableData = result.data;
    renderTable(result.data);
  });
}

function renderTable(data) {
  // </tr>
  //           </thead>
  //           <tbody>
  //             <tr>
  //               <td>0001</td>
  //               <td>Smith</td>
  //               <td>male</td>
  //               <td>123123@outlook.com</td>
  //               <td>6</td>
  //               <td>123123123</td>
  //               <td>Seattle</td>
  //               <td>
  //                 <button class="btn edit">Edit</button>
  //                 <button class="btn delete">Delete</button>
  //               </td>
  //             </tr>
  var str = "";
  for (var i = 0; i < data.length; i++) {
    str +=
      " <tr>\
            <td>" +
      data[i].sNo +
      "</td>\
              <td>" +
      data[i].name +
      "</td>\
              <td>" +
      (data[i].sex ? "Female" : "Male") +
      "</td>\
              <td>" +
      data[i].email +
      "</td>\
              <td>" +
      (new Date().getFullYear() - data[i].birth) +
      "</td>\
             <td>" +
      data[i].phone +
      "</td>\
             <td>" +
      data[i].address +
      "</td>\
            <td><button class='btn edit' data-index=" +
      i +
      ">Edit</button>\
               <button class='btn delete' data-index=" +
      i +
      ">Delete</button>\
             </td>\
          </tr>";
  }

  tbody.innerHTML = str;
}
// New Student Btn
function submitStudent(e) {
  e.preventDefault();
  var form = document.getElementById("addStudentForm");
  var studentObj = getFormData(form);
  if (!studentObj) {
    return false;
  }
  //   Importing Api
  // var result = saveData(
  //   "http://api.duyiedu.com/api/student/addStudent",
  //   Object.assign(studentObj, {
  //     appkey: "d913084825_1559419618338"
  //   })
  // );
  transferData("/api/student/addStudent", studentObj, function(result) {
    alert("Student Added!");
    form.reset();
    var studentListDom = menuList.getElementsByTagName("dd")[0];
    studentListDom.click();
  });
  return false;
}

// Using API Passing Data to Backend
// url: http://api.duyiedu.com/api/student/findAll
// param: {appkey:d913084825_1559419618338}  appkey=d913084825_1559419618338
function saveData(url, param) {
  var result = null;
  var xhr = null;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (typeof param == "string") {
    xhr.open("GET", url + "?" + param, false);
  } else if (typeof param == "object") {
    var str = "";
    for (var prop in param) {
      str += prop + "=" + param[prop] + "&";
    }
    xhr.open("GET", url + "?" + str, false);
  } else {
    xhr.open("GET", url + "?" + param.toString(), false);
  }
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        result = JSON.parse(xhr.responseText);
      }
    }
  };
  xhr.send();
  return result;
}
// url:Route
// param:the data not include appkey
// cb:Call back
function transferData(url, param, cb) {
  var result = saveData(
    "http://api.duyiedu.com" + url,
    Object.assign({ appkey: "d913084825_1559419618338" }, param)
  );
  if (result.status == "success") {
    cb(result);
  } else {
    alert(result.msg);
  }
}
bindEvent();
