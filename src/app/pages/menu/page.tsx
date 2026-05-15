import styles from "./menu.module.css"
import conteine from "../../styles/components.module.css"
import Head from "next/head";


//className={styles.border}
// app/projetos/page.tsx
export default function Projetos() {

  const cidades = [
    "Paraíso do Tocantins",
    "Palmas",
    "Gurupi",
    "Araguaína",
  ];

  return (
    <div className={conteine.contreine}>
      <div className={styles.menu} >
        <Head>
          <title>Criado de linke</title>
        </Head>

        <div>
          <h1>
            Crie rápido um link de afiliado! 
          </h1>

          <div className={styles.conteiner}>
            <strong>Nome do Projeto </strong>
            <input type="text"/>
            <p>Cole a URL de destino </p>
            <input type="text" />

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Criador</label>
                <input type="text" />
              </div>

              <div className={styles.field}>
                <label>Afiliado</label>
                <input type="text" />
              </div>

              <div className={styles.field}>
                <label>Cidade</label>

                <select>
                  {cidades.map((cidade) => (
                    <option key={cidade}>
                      {cidade}
                    </option>
                  ))}
                </select>
              </div>
          </div>

        <div className={styles.button}>
          <button>
            Criar
          </button>
        </div>
          </div>

        </div>
      </div>
    </div>


  );
} 