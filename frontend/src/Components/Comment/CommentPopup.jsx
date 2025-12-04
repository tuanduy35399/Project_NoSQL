import { useState, useEffect } from "react";
import style from "./CommentPopup.module.css";
import axios from "axios";
import { toast } from "sonner";
// Component này nhận 2 props:
// - postId: ID của bài post để fetch comment
// - onClose: Một hàm để đóng popup (do component cha truyền vào)
export default function CommentPopup({ postId, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        // Đây là API giả định, bạn cần thay thế bằng API đúng
        const rs = await axios.get(
          `http://localhost:8080/api/v1/posts/${postId}/comments`
        );
        setComments(rs.data);
      } catch (error) {
        console.error("Không thể tải bình luận:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Xử lý khi gửi comment mới
  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // Ngăn form reload trang
    if (newComment.trim() === "") return;

    try {
      // Giả định API để POST comment mới:
      // BẠN CẦN THAY THẾ BẰNG API THỰC TẾ CỦA MÌNH
      const rs = await axios.post(
        `http://localhost:8080/api/v1/posts/${postId}/comments`,
        {
          text: newComment,
          // Gửi thêm thông tin user nếu cần, ví dụ:
          // userId: "current_user_id"
        }
      );

      // Cập nhật UI ngay lập tức với comment mới
      setComments((prevComments) => [...prevComments, rs.data]);
      setNewComment(""); // Xóa nội dung trong ô input
    } catch (error) {
      console.error("Không thể gửi bình luận:", error);
      toast.error("Gửi bình luận thất bại!");
    }
  };

  return (
    // Lớp phủ mờ toàn màn hình
    <div className={style.overlay} onClick={onClose}>
      {/* Khung popup, ngăn sự kiện click lan ra overlay */}
      <div className={style.popup} onClick={(e) => e.stopPropagation()}>
        <button className={style.closeButton} onClick={onClose}>
          &times;
        </button>
        <h3>Bình luận</h3>

        {/* Danh sách các comment */}
        <div className={style.commentList}>
          {isLoading ? (
            <p>Đang tải bình luận...</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className={style.comment}>
                <strong>{comment.author}</strong>
                <p>{comment.text}</p>
              </div>
            ))
          )}
          {/* Hiển thị nếu không có comment */}
          {!isLoading && comments.length === 0 && (
            <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          )}
        </div>

        {/* Thanh input nhập comment */}
        <form className={style.commentInputBox} onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="Viết bình luận..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Gửi</button>
        </form>
      </div>
    </div>
  );
}
