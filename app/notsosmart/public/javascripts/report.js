async function sendReport() {

        let contract = document.getElementById("contract").value;
        let id = document.getElementById("id").value;
        let network = document.getElementById("network").value;
        $.ajax({
            url: '/checkreport',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                contract: contract,
                id: id,
                network: network
            }),
            success: function (response) {
                alert("Report sent");
            }
        });
        
}