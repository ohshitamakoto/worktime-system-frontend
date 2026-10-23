import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./qrcreator.css";

const createFormUrl = (organization, name) => {
  const compactName = name.replace(/[\u0020\u3000]/g, "");
  return `https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=1vVjSGBHiUW-nEL4LgdXOUd2lHf--exCgxqSIWl-8gtUQTRWTEdRT0dDU0dERlZPVFZXSElLU0JOWCQlQCN0PWcu&r88bb2525477d464586832d8f7c8a2db5=%22%E6%8A%80%E8%A1%93${organization}%E8%AA%B2%22&r297cbbfff910403daa447632d51e9bc0=${encodeURIComponent(compactName)}`;
};

function QrCreator() {
  const [organization, setOrganization] = useState("");
  const [name, setName] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const isOrganizationValid = /^\d{1,2}$/.test(organization)
    && Number(organization) >= 0
    && Number(organization) <= 99;

  const createQrCode = () => {
    if (isOrganizationValid) {
      setGeneratedUrl(createFormUrl(organization, name));
    }
  };

  return (
    <main className="qr-creator">
      <section className="qr-creator__panel" aria-labelledby="qr-creator-title">
        <header className="qr-creator__header">
          <p className="qr-creator__eyebrow">FORM ACCESS</p>
          <h1 id="qr-creator-title">QRコード作成</h1>
          <p className="qr-creator__description">組織と氏名を入力してください。</p>
        </header>

        <div className="qr-creator__fields">
          <label className="qr-creator__field" htmlFor="organization">
            <span>組織</span>
            <input
              id="organization"
              type="number"
              min="0"
              max="99"
              step="1"
              inputMode="numeric"
              value={organization}
              onChange={(event) => {
                setOrganization(event.target.value);
                setGeneratedUrl("");
              }}
              aria-describedby="organization-hint"
              placeholder="0〜99"
            />
            <small id="organization-hint">0〜99の整数</small>
          </label>

          <label className="qr-creator__field" htmlFor="employee-name">
            <span>氏名</span>
            <input
              id="employee-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setGeneratedUrl("");
              }}
              placeholder="氏名を入力"
            />
          </label>
        </div>

        <button
          className="qr-creator__button"
          type="button"
          onClick={createQrCode}
          disabled={!isOrganizationValid}
        >
          QRコード作成
        </button>

        {generatedUrl && (
          <section className="qr-creator__result" aria-live="polite" aria-label="作成したQRコード">
            <QRCodeSVG value={generatedUrl} size={224} level="M" includeMargin />
            <p className="qr-creator__result-name">{name.replace(/[\u0020\u3000]/g, "") || "氏名未入力"}</p>
            <a href={generatedUrl} className="qr-creator__url" target="_blank" rel="noreferrer">
              作成したフォームURLを開く
            </a>
          </section>
        )}
      </section>
    </main>
  );
}

export default QrCreator;