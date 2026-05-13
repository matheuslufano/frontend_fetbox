// app/relatorios/page.tsx
export default function Relatorios() {
  return (
    <div>
      <h1>Relatórios</h1>

      <div className="card">
        <strong>Nome do projeto</strong>
        <p>Altór: usuario</p>
        <p>Afiliado: afiliado</p>
        <p>dd/mm/aaa</p>
      </div>

      <div className="card">
        <strong>Link</strong>
        <p>Página de bio</p>
        <p>bit.ly/matheusMota</p>
        <p>https://matheuslufano.github.io/pagina-de-links/</p>
      </div>


      <strong>Relatorio da campanha</strong>
      <div className="card">
        <strong>Engagement ao longo do tempo</strong>
        <p>Graficos</p>
      </div>

      <div className="card">
        <strong>Localizações</strong>
        <p>Cidades:</p>
        <p>Paraíso</p>
        <p>Palmas</p>
      </div>
      <div className="card">
        <strong>Dispositivos</strong>
        <p>Celular:</p>
        <p>Descktop: </p>
        <p>outros:</p>
      </div>
    </div>
  );
}