async function callApi(inputText: string, appendNewMessage: any){
    try {
        // const response = await fetch('https://backend-dot-group-project372.uw.r.appspot.com/dialogue', { //uncomment when endpoints r active on gcp
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ prompt: inputText }),
        // });
        // const data = await response.json();
        // console.log("data is " + data);
        // const message = data.message;
        const message = "i am working"
        appendNewMessage(message);

      } catch (error) {
        console.error('Error sending message:', error);
      }
}

export default callApi;