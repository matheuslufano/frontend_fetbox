"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Affiliate,
  City,
  User,
  apagarAfiliado,
  apagarUsuario,
  criarAfiliado,
  criarUsuario,
  editarAfiliado,
  editarUsuario,
  getApiErrorMessage,
  listarAfiliados,
  listarCidadesTocantins,
  listarUsuarios,
} from "@/lib/api";
import styles from "./configuracoes.module.css";

type UserForm = {
  name: string;
  email: string;
  password: string;
  city: string;
};

type AffiliateForm = {
  name: string;
  email: string;
  phone: string;
  city: string;
  active: boolean;
};

const emptyUserForm: UserForm = {
  name: "",
  email: "",
  password: "",
  city: "",
};

const emptyAffiliateForm: AffiliateForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  active: true,
};

export default function Configuracoes() {
  const [users, setUsers] = useState<User[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingAffiliateId, setEditingAffiliateId] =
    useState<number | null>(null);
  const [userForm, setUserForm] = useState<UserForm>(emptyUserForm);
  const [affiliateForm, setAffiliateForm] =
    useState<AffiliateForm>(emptyAffiliateForm);
  const [newUser, setNewUser] = useState<UserForm>(emptyUserForm);
  const [newAffiliate, setNewAffiliate] =
    useState<AffiliateForm>(emptyAffiliateForm);

  const activeAffiliates = useMemo(
    () => affiliates.filter((affiliate) => affiliate.active).length,
    [affiliates]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const [userList, affiliateList, cityList] = await Promise.all([
          listarUsuarios(),
          listarAfiliados(),
          listarCidadesTocantins(),
        ]);

        if (!cancelled) {
          setUsers(userList);
          setAffiliates(affiliateList);
          setCities(cityList);
          setNewUser((current) => ({
            ...current,
            city: current.city || cityList[0]?.name || "",
          }));
          setNewAffiliate((current) => ({
            ...current,
            city: current.city || cityList[0]?.name || "",
          }));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            getApiErrorMessage(
              err,
              "Nao foi possivel carregar as configuracoes."
            )
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  function resetStatus() {
    setError(null);
    setMessage(null);
  }

  function startUserEdit(user: User) {
    resetStatus();
    setEditingUserId(user.id);
    setUserForm({
      name: user.name,
      email: user.email,
      password: "",
      city: user.city ?? cities[0]?.name ?? "",
    });
  }

  function startAffiliateEdit(affiliate: Affiliate) {
    resetStatus();
    setEditingAffiliateId(affiliate.id);
    setAffiliateForm({
      name: affiliate.name,
      email: affiliate.email ?? "",
      phone: affiliate.phone ?? "",
      city: affiliate.city ?? cities[0]?.name ?? "",
      active: affiliate.active,
    });
  }

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetStatus();

    const normalizedEmail = newUser.email.trim().toLowerCase();
    const password = newUser.password.trim();

    if (!newUser.name.trim() || !normalizedEmail || !password) {
      setError("Informe nome, e-mail e senha do usuario.");
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    const emailAlreadyExists = users.some(
      (user) => user.email.toLowerCase() === normalizedEmail
    );

    if (emailAlreadyExists) {
      setError("Este e-mail ja esta cadastrado para outro usuario.");
      return;
    }

    setSaving(true);
    try {
      const created = await criarUsuario({
        name: newUser.name.trim(),
        email: normalizedEmail,
        password,
        city: newUser.city || undefined,
      });

      setUsers((current) => [created, ...current]);
      setNewUser({
        ...emptyUserForm,
        city: cities[0]?.name ?? "",
      });
      setMessage("Usuario cadastrado com sucesso.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Nao foi possivel criar o usuario."));
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveUser(id: number) {
    resetStatus();

    const normalizedEmail = userForm.email.trim().toLowerCase();
    const password = userForm.password.trim();

    if (!userForm.name.trim() || !normalizedEmail) {
      setError("Nome e e-mail do usuario sao obrigatorios.");
      return;
    }

    if (password && password.length < 6) {
      setError("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    const emailAlreadyExists = users.some(
      (user) =>
        user.id !== id &&
        user.email.toLowerCase() === normalizedEmail
    );

    if (emailAlreadyExists) {
      setError("Este e-mail ja esta cadastrado para outro usuario.");
      return;
    }

    setSaving(true);
    try {
      const updated = await editarUsuario(id, {
        name: userForm.name.trim(),
        email: normalizedEmail,
        city: userForm.city || undefined,
        password: password || undefined,
      });

      setUsers((current) =>
        current.map((user) => (user.id === id ? updated : user))
      );
      setEditingUserId(null);
      setMessage("Usuario atualizado com sucesso.");
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Nao foi possivel atualizar o usuario.")
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteUser(user: User) {
    resetStatus();

    const confirmed = window.confirm(
      `Apagar o usuario ${user.name}? Links criados por ele tambem serao removidos.`
    );

    if (!confirmed) {
      return;
    }

    setSaving(true);
    try {
      await apagarUsuario(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setMessage("Usuario apagado com sucesso.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Nao foi possivel apagar o usuario."));
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateAffiliate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetStatus();

    if (!newAffiliate.name.trim() || !newAffiliate.email.trim()) {
      setError("Informe nome e e-mail do afiliado.");
      return;
    }

    setSaving(true);
    try {
      const created = await criarAfiliado({
        name: newAffiliate.name.trim(),
        email: newAffiliate.email.trim().toLowerCase(),
        phone: newAffiliate.phone.trim() || undefined,
        city: newAffiliate.city || undefined,
      });

      if (!newAffiliate.active) {
        const inactive = await editarAfiliado(created.id, {
          active: false,
        });
        setAffiliates((current) => [inactive, ...current]);
      } else {
        setAffiliates((current) => [created, ...current]);
      }

      setNewAffiliate({
        ...emptyAffiliateForm,
        city: cities[0]?.name ?? "",
      });
      setMessage("Afiliado cadastrado com sucesso.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Nao foi possivel criar o afiliado."));
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAffiliate(id: number) {
    resetStatus();

    if (!affiliateForm.name.trim() || !affiliateForm.email.trim()) {
      setError("Nome e e-mail do afiliado sao obrigatorios.");
      return;
    }

    setSaving(true);
    try {
      const updated = await editarAfiliado(id, {
        name: affiliateForm.name.trim(),
        email: affiliateForm.email.trim().toLowerCase(),
        phone: affiliateForm.phone.trim() || undefined,
        city: affiliateForm.city || undefined,
        active: affiliateForm.active,
      });

      setAffiliates((current) =>
        current.map((affiliate) =>
          affiliate.id === id ? updated : affiliate
        )
      );
      setEditingAffiliateId(null);
      setMessage("Afiliado atualizado com sucesso.");
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Nao foi possivel atualizar o afiliado.")
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAffiliate(affiliate: Affiliate) {
    resetStatus();

    const confirmed = window.confirm(
      `Apagar o afiliado ${affiliate.name}?`
    );

    if (!confirmed) {
      return;
    }

    setSaving(true);
    try {
      await apagarAfiliado(affiliate.id);
      setAffiliates((current) =>
        current.filter((item) => item.id !== affiliate.id)
      );
      setMessage("Afiliado apagado com sucesso.");
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Nao foi possivel apagar o afiliado.")
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Carregando configuracoes...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.badge}>Administracao</span>
        <h1>Configuracoes</h1>
        <p>Gerencie usuarios, senhas, afiliados e parametros do painel.</p>
      </header>

      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span>Usuarios</span>
          <strong>{users.length}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span>Afiliados ativos</span>
          <strong>{activeAffiliates}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span>API configurada</span>
          <strong>{process.env.NEXT_PUBLIC_API_URL ? "Online" : "Padrao"}</strong>
        </div>
      </section>

      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <section className={styles.grid}>
        <form className={styles.card} onSubmit={handleCreateUser}>
          <div className={styles.cardHeader}>
            <h2>Cadastrar usuario</h2>
            <span>acesso ao painel</span>
          </div>

          <Field
            label="Nome"
            value={newUser.name}
            onChange={(value) =>
              setNewUser((current) => ({ ...current, name: value }))
            }
          />
          <Field
            label="E-mail"
            type="email"
            value={newUser.email}
            onChange={(value) =>
              setNewUser((current) => ({ ...current, email: value }))
            }
          />
          <Field
            label="Senha"
            type="password"
            value={newUser.password}
            onChange={(value) =>
              setNewUser((current) => ({ ...current, password: value }))
            }
          />
          <CitySelect
            cities={cities}
            value={newUser.city}
            onChange={(value) =>
              setNewUser((current) => ({ ...current, city: value }))
            }
          />

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={saving}
            >
              Cadastrar usuario
            </button>
          </div>
        </form>

        <form className={styles.card} onSubmit={handleCreateAffiliate}>
          <div className={styles.cardHeader}>
            <h2>Cadastrar afiliado</h2>
            <span>base comercial</span>
          </div>

          <Field
            label="Nome"
            value={newAffiliate.name}
            onChange={(value) =>
              setNewAffiliate((current) => ({ ...current, name: value }))
            }
          />
          <Field
            label="E-mail"
            type="email"
            value={newAffiliate.email}
            onChange={(value) =>
              setNewAffiliate((current) => ({ ...current, email: value }))
            }
          />
          <Field
            label="Telefone"
            value={newAffiliate.phone}
            onChange={(value) =>
              setNewAffiliate((current) => ({ ...current, phone: value }))
            }
          />
          <CitySelect
            cities={cities}
            value={newAffiliate.city}
            onChange={(value) =>
              setNewAffiliate((current) => ({ ...current, city: value }))
            }
          />
          <label className={styles.checkRow}>
            <input
              type="checkbox"
              checked={newAffiliate.active}
              onChange={(event) =>
                setNewAffiliate((current) => ({
                  ...current,
                  active: event.target.checked,
                }))
              }
            />
            <span>Afiliado ativo</span>
          </label>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={saving}
            >
              Cadastrar afiliado
            </button>
          </div>
        </form>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Usuarios cadastrados</h2>
          <span>{users.length} registros</span>
        </div>

        <div className={styles.list}>
          {users.map((user) => (
            <div key={user.id} className={styles.item}>
              {editingUserId === user.id ? (
                <div className={styles.editGrid}>
                  <Field
                    label="Nome"
                    value={userForm.name}
                    onChange={(value) =>
                      setUserForm((current) => ({
                        ...current,
                        name: value,
                      }))
                    }
                  />
                  <Field
                    label="E-mail"
                    type="email"
                    value={userForm.email}
                    onChange={(value) =>
                      setUserForm((current) => ({
                        ...current,
                        email: value,
                      }))
                    }
                  />
                  <Field
                    label="Nova senha"
                    type="password"
                    value={userForm.password}
                    placeholder="Deixe em branco para manter"
                    onChange={(value) =>
                      setUserForm((current) => ({
                        ...current,
                        password: value,
                      }))
                    }
                  />
                  <CitySelect
                    cities={cities}
                    value={userForm.city}
                    onChange={(value) =>
                      setUserForm((current) => ({
                        ...current,
                        city: value,
                      }))
                    }
                  />
                </div>
              ) : (
                <div className={styles.itemInfo}>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <span>{user.city ?? "Sem cidade"}</span>
                </div>
              )}

              <div className={styles.actions}>
                {editingUserId === user.id ? (
                  <>
                    <button
                      type="button"
                      className={styles.primaryButton}
                      onClick={() => handleSaveUser(user.id)}
                      disabled={saving}
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => setEditingUserId(null)}
                      disabled={saving}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => startUserEdit(user)}
                    disabled={saving}
                  >
                    Editar
                  </button>
                )}
                <button
                  type="button"
                  className={styles.dangerButton}
                  onClick={() => handleDeleteUser(user)}
                  disabled={saving}
                >
                  Apagar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Afiliados</h2>
          <span>{affiliates.length} registros</span>
        </div>

        <div className={styles.list}>
          {affiliates.map((affiliate) => (
            <div key={affiliate.id} className={styles.item}>
              {editingAffiliateId === affiliate.id ? (
                <div className={styles.editGrid}>
                  <Field
                    label="Nome"
                    value={affiliateForm.name}
                    onChange={(value) =>
                      setAffiliateForm((current) => ({
                        ...current,
                        name: value,
                      }))
                    }
                  />
                  <Field
                    label="E-mail"
                    type="email"
                    value={affiliateForm.email}
                    onChange={(value) =>
                      setAffiliateForm((current) => ({
                        ...current,
                        email: value,
                      }))
                    }
                  />
                  <Field
                    label="Telefone"
                    value={affiliateForm.phone}
                    onChange={(value) =>
                      setAffiliateForm((current) => ({
                        ...current,
                        phone: value,
                      }))
                    }
                  />
                  <CitySelect
                    cities={cities}
                    value={affiliateForm.city}
                    onChange={(value) =>
                      setAffiliateForm((current) => ({
                        ...current,
                        city: value,
                      }))
                    }
                  />
                  <label className={styles.checkRow}>
                    <input
                      type="checkbox"
                      checked={affiliateForm.active}
                      onChange={(event) =>
                        setAffiliateForm((current) => ({
                          ...current,
                          active: event.target.checked,
                        }))
                      }
                    />
                    <span>Ativo</span>
                  </label>
                </div>
              ) : (
                <div className={styles.itemInfo}>
                  <strong>{affiliate.name}</strong>
                  <span>{affiliate.email ?? "Sem e-mail"}</span>
                  <span>
                    {affiliate.city ?? "Sem cidade"} |{" "}
                    {affiliate.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
              )}

              <div className={styles.actions}>
                {editingAffiliateId === affiliate.id ? (
                  <>
                    <button
                      type="button"
                      className={styles.primaryButton}
                      onClick={() => handleSaveAffiliate(affiliate.id)}
                      disabled={saving}
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => setEditingAffiliateId(null)}
                      disabled={saving}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => startAffiliateEdit(affiliate)}
                    disabled={saving}
                  >
                    Editar
                  </button>
                )}
                <button
                  type="button"
                  className={styles.dangerButton}
                  onClick={() => handleDeleteAffiliate(affiliate)}
                  disabled={saving}
                >
                  Apagar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function CitySelect({
  cities,
  value,
  onChange,
}: {
  cities: City[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.field}>
      <span>Cidade</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Sem cidade</option>
        {cities.map((city) => (
          <option key={city.id} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </label>
  );
}
