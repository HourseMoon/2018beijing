$(function () {
    $("#loginBtn").on("click", function () {
        var login = {
            "method": "login",
            "password": ""
        };
        login.password = $("#input input").val();
        console.log(login);
        if ($("#input input").val() != '') {
            $.ajax({
                url: "http://192.168.0.96:3000/login",
                type: "post",
                data: {
                    packages: JSON.stringify(login)
                },
                success: function (data) {
                    if (data.result) {
                        var aFile = document.createElement("a");
                        aFile.setAttribute("href", "../content/index.html");
                        aFile.style.display = "none";
                        document.body.appendChild(aFile);
                        aFile.click();
                        document.body.removeChild(aFile);
                    }
                }
            });
        }
    });
})