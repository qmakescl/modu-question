import csv
import requests
import time

# LM Studio LLM API 엔드포인트
API_URL = "http://localhost:1234/v1/chat/completions"
MODEL_NAME = "hyperclovax-seed-text-instruct-1.5b-hf-i1"

CATEGORIES = [
    "정치 및 거버넌스", "사회 및 복지", "법과 윤리", "교육 및 입시", "경제 및 산업",
    "도시 및 주거", "노동 및 고용", "가족", "삶 또는 라이프스타일", "과학기술과 혁신",
    "디지털 사회와 정보화", "국제 관계 및 외교", "환경 및 기후변화", "건강과 의료",
    "공동체와 신뢰", "통일 및 국방", "문화, 콘텐츠, 미디어", "기타"
]

PROMPT_TEMPLATE = '''다음 시민 질문을 아래 분야 중 하나로 분류해 주세요.\n분야: {categories}\n질문: "{content}"\n카테고리명만 한글로 정확히 답변해 주세요.'''

def classify_content(content):
    prompt = PROMPT_TEMPLATE.format(categories=", ".join(CATEGORIES), content=content)
    data = {
        "model": MODEL_NAME,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0
    }
    try:
        response = requests.post(API_URL, json=data, timeout=60)
        response.raise_for_status()
        result = response.json()['choices'][0]['message']['content'].strip()
        return result
    except Exception as e:
        print(f"[ERROR] {content} => {e}")
        return "기타"

if __name__ == "__main__":
    import io
    RAW_CSV_URL = "https://raw.githubusercontent.com/q4all/greenpaper/refs/heads/main/2025%EB%85%84%20%EC%8B%9C%EC%A6%8C1/%EB%AA%A8%EB%91%90%EC%9D%98%EC%A7%88%EB%AC%B8Q%20%EC%8B%9C%EC%A6%8C1.csv"
    output_csv = "output_with_category.csv"

    # 1. 원본 CSV 다운로드
    print("원본 데이터 다운로드 중...")
    response = requests.get(RAW_CSV_URL)
    response.raise_for_status()
    csv_text = response.content.decode('utf-8').replace('\x00', '')  # NUL 제거
    infile = io.StringIO(csv_text)

    # 2. 분류 및 저장
    with infile, open(output_csv, 'w', newline='', encoding='utf-8') as outfile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames + ['category']
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        
        from html.parser import HTMLParser

        class MLStripper(HTMLParser):
            def __init__(self):
                super().__init__()
                self.reset()
                self.fed = []
            def handle_data(self, d):
                self.fed.append(d)
            def get_data(self):
                return ''.join(self.fed)

        def strip_tags(html):
            s = MLStripper()
            s.feed(html)
            return s.get_data()

        for idx, row in enumerate(reader, 1):
            try:
                if not any(row.values()):
                    continue  # 빈 줄이면 건너뜀
                content_html = row['contents']
                content_text = strip_tags(content_html)
                if idx % 100 == 0:
                    print(f"{idx} rows processed...")
                category = classify_content(content_text)
                row['category'] = category
                writer.writerow(row)
            except Exception as e:
                print(f"[ERROR] Row {idx}: {e}")
                continue
    print(f"완료! 결과 파일: {output_csv}")
