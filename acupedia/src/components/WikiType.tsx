import { useState } from 'react';

export type WikiTemplateType =
  | 'acupointTheory'
  | 'meridian'
  | 'acupoint'
  | 'meridianTheory'
  | 'technique'
  | 'combination'
  | 'disease'
  | 'other';

export interface WikiContentRequest {
  key: number;
  html: string;
}

interface WikiTypeOption {
  value: WikiTemplateType;
  label: string;
}

interface WikiTypeProps {
  title: string;
  onTitleChange: (value: string) => void;
  onApplyContent: (html: string, message: string) => boolean;
}

const wikiTypeOptions: WikiTypeOption[] = [
  { value: 'acupointTheory', label: '경락·경혈 이론형' },
  { value: 'meridian', label: '경맥형' },
  { value: 'acupoint', label: '개별 경혈형' },
  { value: 'meridianTheory', label: '경락 이론형' },
  { value: 'technique', label: '침구법·치료기술형' },
  { value: 'combination', label: '배혈·처방형' },
  { value: 'disease', label: '질환형' },
  { value: 'other', label: '기타' },
];

/*const templateDescriptions: Record<WikiTemplateType, string> = {
  acupointTheory:
    '오수혈, 원혈, 락혈, 극혈, 팔맥교회혈 등 경혈의 분류와 이론적 체계를 설명하는 문서에 사용하는 양식입니다.',
  meridian:
    '수태음폐경, 족양명위경, 독맥, 임맥 등 하나의 경맥을 종합적으로 설명하는 문서에 사용하는 양식입니다.',
  acupoint:
    '합곡, 후계, 족삼리 등 하나의 경혈을 대상으로 역사, 위치, 주치, 배혈, 현대 연구 등을 정리하는 양식입니다.',
  meridianTheory:
    '십이경별, 십이경근, 십오락맥, 근결, 표본 등 경락 관련 이론을 설명하는 문서에 사용하는 양식입니다.',
  technique:
    '도침, 전침, 온침, 사혈, 자락법 등 침구 치료기술을 설명하는 문서에 사용하는 양식입니다.',
  combination:
    '원락배혈, 사관혈, 후계-신맥 등 경혈의 조합과 배혈 이론을 설명하는 문서에 사용하는 양식입니다.',
  disease:
    '요통, 편두통, 안면마비, 불임 등 한 질환을 대상으로 개념, 변증, 침구 치료, 고전문헌, 현대 연구 등을 정리하는 문서에 사용하는 양식입니다.',
  other:
    '기존 문서 유형에 해당하지 않는 주제를 작성할 때 사용하는 양식입니다. 「개요」만 필수이며, 이후 문단은 작성자가 자유롭게 추가합니다.',
};*/

function guide(text: string) {
  return `
    <div class="guide-box">
      <strong>작성 가이드</strong><br>
      ${text}
    </div>
    <p><br></p>
  `;
}

export const wikiTemplates: Record<WikiTemplateType, string> = {
  acupointTheory: `
    <h2>개요</h2>
    ${guide(`
      해당 개념이 무엇인지 처음 접하는 독자도 이해할 수 있도록
      핵심 정의와 중요성을 2~4문장으로 설명합니다.
      "본 보고서에서는", "알아보고자 한다" 등의
      보고서식 표현은 사용하지 않습니다.
    `)}
    <h2>명칭과 정의</h2>
    <h3>명칭</h3>
    ${guide('한자명, 이명, 영어명 등 명칭과 관련된 정보를 기술합니다.')}
    <h3>정의</h3>
    ${guide('개념의 정확한 정의와 유사 개념과의 차이를 설명합니다.')}
    <h2>역사</h2>
    <h3>기원</h3>
    ${guide('해당 개념이 등장하는 초기 문헌 및 역사적 배경을 정리합니다.')}
    <h3>후대의 발전</h3>
    ${guide('시대별로 개념이 어떻게 변화하거나 체계화되었는지 설명합니다.')}
    <h2>구성</h2>
    ${guide(`
      해당 체계를 구성하는 경혈이나 요소를 설명합니다.
      비교가 필요한 경우 표를 적극적으로 사용합니다.
    `)}
    <h2>이론적 의미</h2>
    ${guide('다른 경락·경혈 이론과 어떤 관계가 있는지 설명합니다.')}
    <h2>고전문헌</h2>
    ${guide(`
      관련 고전 기록을 단순 나열하지 말고
      원문 → 번역 → 설명 → 해당 기록의 의의 순으로 정리합니다.
    `)}
    <h2>임상적 활용</h2>
    ${guide('전통적인 활용과 현대 임상에서의 활용을 구분하여 설명합니다.')}
    <h2>현대 연구</h2>
    ${guide(`
      특정 논문 한 편의 연구목적·방법·결과를 순서대로
      요약하지 않습니다. 여러 연구를 주제별로 종합하여
      현재까지 알려진 내용과 한계를 기술합니다.
    `)}
    <h2>논쟁 및 해석상의 차이</h2>
    ${guide('문헌, 시대 또는 학설에 따라 견해가 다른 사항을 정리합니다.')}
    <h2>관련 문서</h2>
    ${guide('Acupedia 내에서 함께 읽을 가치가 있는 관련 위키를 연결합니다.')}
    <h2>참고문헌</h2>
    <h3>고전문헌</h3>
    <p><br></p>
    <h3>현대 단행본</h3>
    <p><br></p>
    <h3>학술논문</h3>
    <p><br></p>
  `,
  meridian: `
    <h2>개요</h2>
    ${guide('해당 경맥의 기본 정의와 경락체계에서의 위치를 설명합니다.')}
    <h2>명칭</h2>
    ${guide('한자명, 약칭, 영문명 및 명칭과 관련된 정보를 기술합니다.')}
    <h2>역사</h2>
    ${guide('고전문헌을 중심으로 해당 경맥 개념의 성립과 변화를 설명합니다.')}
    <h2>유주</h2>
    ${guide('경맥의 유주를 본문과 필요시 그림을 이용하여 설명합니다.')}
    <h2>소속 경혈</h2>
    ${guide('해당 경맥에 속하는 경혈을 정리합니다.')}
    <h2>장부와의 관계</h2>
    ${guide('소속 장부 및 관련 장부와의 관계를 기술합니다.')}
    <h2>다른 경맥과의 연결</h2>
    ${guide('표리경 및 다른 경맥과의 연결관계를 설명합니다.')}
    <h2>경별</h2>
    <p><br></p>
    <h2>락맥</h2>
    <p><br></p>
    <h2>경근</h2>
    <p><br></p>
    <h2>고전문헌</h2>
    <p><br></p>
    <h2>병후 및 주치</h2>
    <p><br></p>
    <h2>현대적 해석</h2>
    <p><br></p>
    <h2>관련 문서</h2>
    <p><br></p>
    <h2>참고문헌</h2>
    <p><br></p>
  `,
  acupoint: `
    <h2>개요</h2>
    ${guide('해당 경혈의 소속 경맥, 주요 분류 및 특징을 간략하게 설명합니다.')}
    <h2>명칭</h2>
    <h3>혈명의 의미</h3>
    <p><br></p>
    <h3>이명</h3>
    <p><br></p>
    <h2>소속과 분류</h2>
    <p><br></p>
    <h2>위치</h2>
    <h3>고전의 위치</h3>
    <p><br></p>
    <h3>현대 표준 위치</h3>
    <p><br></p>
    <h3>해부학적 위치</h3>
    <p><br></p>
    <h2>취혈</h2>
    <p><br></p>
    <h2>혈성 및 주치</h2>
    <h3>고전 기록</h3>
    <p><br></p>
    <h3>현대 침구학</h3>
    <p><br></p>
    <h2>배혈</h2>
    <p><br></p>
    <h2>고전문헌</h2>
    <p><br></p>
    <h2>역사적 변화</h2>
    <p><br></p>
    <h2>현대 연구</h2>
    ${guide('특정 논문 하나를 요약하는 대신 연구 분야별 결과를 종합합니다.')}
    <h2>관련 문서</h2>
    <p><br></p>
    <h2>참고문헌</h2>
    <p><br></p>
  `,
  meridianTheory: `
    <h2>개요</h2>
    <p><br></p>
    <h2>개념과 명칭</h2>
    <p><br></p>
    <h2>역사</h2>
    <p><br></p>
    <h2>기본 구조</h2>
    <p><br></p>
    <h2>구성</h2>
    <p><br></p>
    <h2>십이경맥과의 관계</h2>
    <p><br></p>
    <h2>장부와의 관계</h2>
    <p><br></p>
    <h2>관련 이론</h2>
    <p><br></p>
    <h2>고전문헌</h2>
    <p><br></p>
    <h2>후대의 해석</h2>
    <p><br></p>
    <h2>현대적 해석</h2>
    <p><br></p>
    <h2>관련 문서</h2>
    <p><br></p>
    <h2>참고문헌</h2>
    <p><br></p>
  `,
  technique: `
    <h2>개요</h2>
    <p><br></p>
    <h2>명칭과 정의</h2>
    <p><br></p>
    <h2>역사</h2>
    <p><br></p>
    <h2>원리</h2>
    <p><br></p>
    <h2>기구</h2>
    <p><br></p>
    <h2>시술 방법</h2>
    <p><br></p>
    <h2>적응 및 활용</h2>
    <p><br></p>
    <h2>주의사항</h2>
    <p><br></p>
    <h2>전통 침구법과의 관계</h2>
    <p><br></p>
    <h2>현대 연구</h2>
    <p><br></p>
    <h2>관련 문서</h2>
    <p><br></p>
    <h2>참고문헌</h2>
    <p><br></p>
  `,
  combination: `
    <h2>개요</h2>
    <p><br></p>
    <h2>구성</h2>
    <p><br></p>
    <h2>유래</h2>
    <p><br></p>
    <h2>이론적 근거</h2>
    <p><br></p>
    <h2>고전문헌</h2>
    <p><br></p>
    <h2>전통적 활용</h2>
    <p><br></p>
    <h2>후대의 활용</h2>
    <p><br></p>
    <h2>현대 임상</h2>
    <p><br></p>
    <h2>관련 연구</h2>
    <p><br></p>
    <h2>유사한 배혈</h2>
    <p><br></p>
    <h2>관련 문서</h2>
    <p><br></p>
    <h2>참고문헌</h2>
    <p><br></p>
  `,
  disease: `
    <h2>개요</h2>
    ${guide(`
      해당 질환이 무엇인지 처음 접하는 독자도 이해할 수 있도록
      핵심 정의, 임상적 중요성, 한의학에서의 위치를
      2~4문장으로 설명합니다.
      "본 보고서에서는", "알아보고자 한다" 등의
      보고서식 표현은 사용하지 않습니다.
    `)}
    <h2>원인</h2>
    ${guide(`
      전통 한의학 관점의 병인·병기와 현대의학적 원인을
      필요한 범위에서 정리합니다.
      필요시 외인·내인·불내인 등으로 구분합니다.
    `)}
    <h2>증상</h2>
    ${guide(`
      주요 증상, 동반 증상, 경과 및 임상에서 흔히 관찰되는
      양상을 정리합니다. 단순 나열이 아니라 독자가
      질환의 전체 모습을 파악할 수 있도록 기술합니다.
    `)}
    <h2>진단</h2>
    ${guide(`
      진단 기준, 변증 분류, 유사 질환과의 감별 포인트를
      정리합니다. 전통 변증과 현대의학적 진단이
      모두 관련되면 구분하여 기술합니다.
    `)}
    <h2>치료</h2>
    ${guide(`
      침, 한약 등 한의학 치료의 원칙과 주요 방법을
      변증과 연결하여 설명합니다.
      비교가 필요한 경우 표를 적극적으로 사용하고,
      병용 시술·주의사항도 함께 기술합니다.
    `)}
    <h2>예후와 주의사항</h2>
    ${guide('일반적인 예후, 재발 요인, 시술 시 금기·주의사항을 정리합니다.')}
    <h2>현대 연구</h2>
    ${guide(`
      특정 논문 한 편의 연구목적·방법·결과를 순서대로
      요약하지 않습니다. 여러 연구를 주제별로 종합하여
      현재까지 알려진 내용과 한계를 기술합니다.
    `)}
    <h2>관련 문서</h2>
    ${guide(`
      Acupedia 내에서 함께 읽을 가치가 있는 관련 위키나
      학술자료고 문서, 혹은 기타 외부 문서를 연결합니다.
    `)}
    <h2>참고문헌</h2>
    <h3>고전문헌</h3>
    <p><br></p>
    <h3>현대 단행본</h3>
    <p><br></p>
    <h3>학술논문</h3>
    <p><br></p>
  `,
  other: `
    <h2>개요</h2>
    ${guide(`
      해당 문서의 주제가 무엇인지 처음 접하는 독자도 이해할 수 있도록
      핵심 내용을 2~4문장으로 설명합니다.
      기타 유형에서는 「개요」만 필수 항목입니다.
      "본 보고서에서는", "알아보고자 한다" 등의
      보고서식 표현은 사용하지 않습니다.
    `)}
    ${guide(`
      아래에는 미리 정해진 항목이 없습니다.
      필요에 따라 제목 2(H2) 또는 제목 3(H3)을 추가하여
      문단을 자유롭게 구성하세요.
      「목차 생성/갱신」을 누르면 추가한 제목을 바탕으로
      번호와 목차가 자동으로 만들어집니다.
    `)}
  `,
};

const TEMPLATE_LOAD_MESSAGE =
  '선택한 문서 유형의 표준 양식을 불러오시겠습니까?';

function WikiType({ title, onTitleChange, onApplyContent }: WikiTypeProps) {
  const [selected, setSelected] = useState<WikiTemplateType>('acupointTheory');

  const applyTemplate = (type: WikiTemplateType) =>
    onApplyContent(wikiTemplates[type], TEMPLATE_LOAD_MESSAGE);

  const handleTypeChange = (value: WikiTemplateType) => {
    if (!applyTemplate(value)) return;
    setSelected(value);
  };

  return (
    <section className="wikiType">
      <div className="subLeft__titleBox wikiType__titleBox">
        <input
          id="wikiTitle"
          type="text"
          maxLength={20}
          className="subLeft__title wikiType__titleInput"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          autoFocus
        />
      </div>

      <div className="wikiType__typeRow">
        <div className="wikiType__typeGroup">
          <label className="wikiType__typeLabel" htmlFor="templateType">
            문서 유형
          </label>
          <select
            id="templateType"
            className="wikiType__select"
            value={selected}
            onChange={(e) =>
              handleTypeChange(e.target.value as WikiTemplateType)
            }
          >
            {wikiTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="wikiType__load"
            onClick={() => applyTemplate(selected)}
          >
            표준 양식 불러오기
          </button>
        </div>
        <div className="wikiType__needGroup">
          <span className="wikiType__hint">
            만약 어떤 위키를 작성할지 고민되면?
          </span>
          <button
            type="button"
            className="wikiType__load"
            onClick={() =>
              window.open(`${process.env.PUBLIC_URL || ''}/wikiNeeded`, '_blank')
            }
          >
            + 작성이 필요한 문서
          </button>
        </div>
      </div>
      {/*<p className="wikiType__desc">{templateDescriptions[selected]}</p>*/}
    </section>
  );
}

export default WikiType;
