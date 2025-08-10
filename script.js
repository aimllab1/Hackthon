const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxx6lT1gWkVWCfP0HkCCMlJGTXB3_73PoQhM4gEl62Ys6x7HE5IpuPmt-WYN_zr_UEc/exec";
const SECRET = "YOUR_SECRET_TOKEN";

document.addEventListener('DOMContentLoaded', function(){
  // elements
  const regBtn = document.getElementById('registration-button');
  const chatBtn = document.getElementById('chatbot-button');
  const regPopup = document.getElementById('registration-container');
  const chatPopup = document.getElementById('chatbot-container');
  const closeReg = document.getElementById('close-registration');
  const closeChat = document.getElementById('close-chat');
  const teamForm = document.getElementById('team-form');
  const loadingEl = document.getElementById('form-loading');
  const successEl = document.getElementById('form-success');
  const messagesDiv = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');

  // show/hide popups
  function show(el){ el.classList.add('show'); el.setAttribute('aria-hidden','false'); }
  function hide(el){ el.classList.remove('show'); el.setAttribute('aria-hidden','true'); }

  regBtn.addEventListener('click', function(){ show(regPopup); });
  closeReg.addEventListener('click', function(){ hide(regPopup); resetFormUI(); });
  chatBtn.addEventListener('click', function(){ show(chatPopup); });
  closeChat.addEventListener('click', function(){ hide(chatPopup); });

  // Reset form UI
  function resetFormUI(){ teamForm.reset(); teamForm.classList.remove('hidden'); loadingEl.classList.add('hidden'); successEl.classList.add('hidden'); }

  // helper: formData -> URLSearchParams
  function formDataToParams(fd){ var params = new URLSearchParams(); for(var pair of fd.entries()){ params.append(pair[0], pair[1]); } return params; }

  // submit registration
  teamForm.addEventListener('submit', async function(e){
    e.preventDefault();

    var fd = new FormData(teamForm); // gather form data
    var params = formDataToParams(fd);
    params.append('token', SECRET);

    try{
      // send data first
      var res = await fetch(WEB_APP_URL, { method:'POST', body: params });
      try{ await res.json(); }catch(e){ /* ignore parse errors */ }

      // After submission success: hide form and show loading for a few seconds
      teamForm.classList.add('hidden');
      loadingEl.classList.remove('hidden');

      // Keep loading for 2 seconds then show success
      setTimeout(function(){
        loadingEl.classList.add('hidden');
        successEl.classList.remove('hidden');

        // Keep success message for 1.8 sec, then close popup and reset
        setTimeout(function(){
          hide(regPopup); resetFormUI();
        }, 1800);

      }, 2000); // loading duration in ms
    }catch(err){
      console.error(err);
      loadingEl.classList.add('hidden');
      teamForm.classList.remove('hidden');
      alert('Submission failed. Try again.');
    }
  });

  // Chatbot initial list (as bot messages)
  function addMessage(text, sender){ var d = document.createElement('div'); d.className = sender==='bot' ? 'bot-message' : 'user-message'; d.textContent = text; messagesDiv.appendChild(d); messagesDiv.scrollTop = messagesDiv.scrollHeight; }
  addMessage("I'm Riotz Bot . . . You can ask",'bot');
  addMessage('1. Prize amount','bot');
  addMessage('2. Event Name','bot');
  addMessage('3. Who is conducting','bot');
  addMessage('4. Title','bot');
  addMessage('5. Entry fee','bot');

  // send on click or Enter
  sendBtn.addEventListener('click', handleChatSend);
  userInput.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); handleChatSend(); } });

  function handleChatSend(){
    var txt = userInput.value.trim(); if(!txt) return;
    addMessage(txt,'user'); var lower = txt.toLowerCase();
    if(lower.indexOf('prize') !== -1) addMessage('₹5000 cash','bot');
    else if(lower.indexOf('event name') !== -1 || lower==='event' || lower.indexOf('what is the event') !== -1) addMessage('AI Road Pilot Hackathon','bot');
    else if(lower.indexOf('who is conducting') !== -1 || lower.indexOf('conducted') !== -1) addMessage('Department of CSE (AI & ML), Adhiparasakthi Engineering College','bot');
    else if(lower.indexOf('title') !== -1) addMessage('AI Road Pilot Hackathon','bot');
    else if(lower.indexOf('entry fee') !== -1 || lower.indexOf('fee') !== -1) addMessage('Free (No entry fee)','bot');
    else {
        addMessage("I'm Riotz Bot . . . You can ask", 'bot');
        addMessage('1. Prize amount','bot');
        addMessage('2. Event Name','bot');
        addMessage('3. Who is conducting','bot');
        addMessage('4. Title','bot');
        addMessage('5. Entry fee','bot');
    }
    userInput.value='';
  }

  // Accessibility: close popups on Escape
  document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ hide(chatPopup); hide(regPopup); resetFormUI(); } });

});
