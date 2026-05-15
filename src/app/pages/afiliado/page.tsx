"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./menu.module.css";
import conteine from "../../styles/components.module.css";
import api from "../../../services/api";

type Affiliate = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  active: boolean;
};

type City = {
  id: number;
  name: string;
  uf: string;
};

export default function Afiliado() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCities, setLoadingCities] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshAffiliates() {
    setLoading(true);
    try {
      const { data } = await api.get<Affiliate[]>("/affiliate");
      setAffiliates(Array.isArray(data) ? data : []);
    } catch {
      setAffiliates([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialAffiliates() {
      try {
        const { data } = await api.get<Affiliate[]>("/affiliate");
        if (!cancelled) {
          setAffiliates(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) {
          setAffiliates([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInitialAffiliates();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadCities() {
      try {
        const { data } = await api.get<City[]>("/cities/tocantins");
        if (!cancelled) {
          const list = Array.isArray(data) ? data : [];
          setCities(list);
          setCity(list[0]?.name ?? "");
        }
      } catch {
        if (!cancelled) {
          setCities([]);
          setCity("");
        }
      } finally {
        if (!cancelled) {
          setLoadingCities(false);
        }
      }
    }

    loadCities();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!name.trim() || !email.trim()) {
      setError("Nome e e-mail sao obrigatorios.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/affiliate", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });

      setName("");
      setPhone("");
      setEmail("");
      setCity(cities[0]?.name ?? "");
      setMessage("Afiliado criado com sucesso.");
      await refreshAffiliates();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(String(err.response.data.error));
      } else {
        setError("Nao foi possivel criar o afiliado.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={conteine.contreine}>
      <div>
        <h2>Cadastro de afiliados</h2>

        <form className={styles.conteiner} onSubmit={handleSubmit}>
          <strong>Nome do afiliado</strong>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Numero</label>
              <input
                type="text"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>e-mail</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Cidade</label>
              <select
                value={city}
                onChange={(event) => setCity(event.target.value)}
                disabled={loadingCities}
              >
                {loadingCities && <option>Carregando cidades...</option>}
                {!loadingCities && cities.length === 0 && (
                  <option>Nenhuma cidade encontrada</option>
                )}
                {cities.map((cidade) => (
                  <option key={cidade.id} value={cidade.name}>
                    {cidade.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.button}>
            <button type="submit" disabled={submitting}>
              {submitting ? "Criando..." : "Criar"}
            </button>
          </div>

          {error && <p style={{ color: "#b00020" }}>{error}</p>}
          {message && <p style={{ color: "#137333" }}>{message}</p>}
        </form>

        <div className={styles.conteiner} style={{ marginTop: 24 }}>
          <strong>Afiliados cadastrados</strong>
          {loading ? (
            <p>Carregando...</p>
          ) : affiliates.length === 0 ? (
            <p>Nenhum afiliado cadastrado.</p>
          ) : (
            <ul style={{ paddingLeft: 20 }}>
              {affiliates.map((affiliate) => (
                <li key={affiliate.id}>
                  {affiliate.name} - {affiliate.email}
                  {affiliate.phone ? ` - ${affiliate.phone}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
