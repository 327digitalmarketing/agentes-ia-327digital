(function() {
  // Obtener client-id del script tag
  const script = document.currentScript;
  const clientId = script.getAttribute('data-client-id');

  if (!clientId) {
    console.error('Chat Widget: data-client-id is required');
    return;
  }

  // Crear contenedor del widget
  const container = document.createElement('div');
  container.id = 'chat-widget-container';
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    height: 600px;
    border-radius: 12px;
    box-shadow: 0 5px 40px rgba(0,0,0,0.16);
    background: white;
    z-index: 9999;
    display: none;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;

  // Crear botón flotante
  const button = document.createElement('button');
  button.id = 'chat-widget-button';
  button.innerHTML = '💬';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 28px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
    z-index: 9998;
  `;

  button.onmouseover = () => {
    button.style.transform = 'scale(1.1)';
  };

  button.onmouseout = () => {
    button.style.transform = 'scale(1)';
  };

  button.onclick = () => {
    const isOpen = container.style.display === 'flex';
    container.style.display = isOpen ? 'none' : 'flex';
    button.style.display = isOpen ? 'block' : 'none';
  };

  // Crear header del chat
  const header = document.createElement('div');
  header.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  const title = document.createElement('h3');
  title.innerHTML = '🤖 Agente IA';
  title.style.cssText = 'margin: 0; font-size: 16px;';

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
  `;

  closeBtn.onclick = () => {
    container.style.display = 'none';
    button.style.display = 'block';
  };

  header.appendChild(title);
  header.appendChild(closeBtn);

  // Crear iframe para el chat
  const iframe = document.createElement('iframe');
  iframe.style.cssText = `
    flex: 1;
    border: none;
    border-radius: 0 0 12px 12px;
  `;

  const iframeUrl = `https://agentesia327digital.vercel.app/chat-iframe.html?clientId=${encodeURIComponent(clientId)}`;
  iframe.src = iframeUrl;

  container.appendChild(header);
  container.appendChild(iframe);

  // Agregar al DOM
  document.body.appendChild(container);
  document.body.appendChild(button);
})();
