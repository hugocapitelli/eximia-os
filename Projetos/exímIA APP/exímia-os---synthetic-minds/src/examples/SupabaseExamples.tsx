import { useAuth } from '../hooks/useAuth'
import { useAcademy } from '../hooks/useAcademy'
import { useBiblioteca } from '../hooks/useBiblioteca'

/**
 * AUTHENTICATION EXAMPLES
 */
export function AuthenticationExamples() {
  const { user, loading, signIn, signUp, signOut } = useAuth()

  // Sign up new user
  const handleSignUp = async () => {
    const { data, error } = await signUp(
      'user@example.com',
      'password123',
      'John Doe'
    )
    if (error) console.error('Sign up error:', error)
    else console.log('User created:', data)
  }

  // Sign in existing user
  const handleSignIn = async () => {
    const { data, error } = await signIn('user@example.com', 'password123')
    if (error) console.error('Sign in error:', error)
    else console.log('Signed in:', data)
  }

  // Sign out
  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) console.error('Sign out error:', error)
    else console.log('Signed out successfully')
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <>
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleSignIn}>Sign In</button>
        </>
      )}
    </div>
  )
}

/**
 * ACADEMY EXAMPLES
 */
export function AcademyExamples() {
  const {
    getCourses,
    getCourse,
    enrollCourse,
    getEnrollments,
    updateLessonProgress,
  } = useAcademy()

  // List all published courses
  const listCourses = async () => {
    const { data, error } = await getCourses()
    if (error) console.error('Error fetching courses:', error)
    else console.log('Courses:', data)
  }

  // Get course details
  const viewCourse = async () => {
    const { data, error } = await getCourse('intro-javascript')
    if (error) console.error('Error fetching course:', error)
    else console.log('Course details:', data)
  }

  // Enroll in a course
  const enroll = async (courseId: string) => {
    const { data, error } = await enrollCourse(courseId)
    if (error) console.error('Enrollment error:', error)
    else console.log('Enrolled:', data)
  }

  // Get my enrollments
  const myEnrollments = async () => {
    const { data, error } = await getEnrollments()
    if (error) console.error('Error fetching enrollments:', error)
    else console.log('My enrollments:', data)
  }

  // Mark lesson as complete
  const completeLesson = async (lessonId: string, enrollmentId: string) => {
    const { data, error } = await updateLessonProgress(
      lessonId,
      enrollmentId,
      true
    )
    if (error) console.error('Error updating progress:', error)
    else console.log('Lesson completed:', data)
  }

  return (
    <div>
      <h2>Academy Examples</h2>
      <button onClick={listCourses}>List All Courses</button>
      <button onClick={viewCourse}>View Course Details</button>
      <button onClick={() => enroll('course-uuid')}>Enroll in Course</button>
      <button onClick={myEnrollments}>My Enrollments</button>
    </div>
  )
}

/**
 * BIBLIOTECA EXAMPLES
 */
export function BibliotecaExamples() {
  const {
    getBooks,
    addBook,
    updateBook,
    deleteBook,
    updateProgress,
    addNote,
    getNotes,
    getReadingGoal,
    setReadingGoal,
  } = useBiblioteca()

  // Add a new book
  const addNewBook = async () => {
    const { data, error } = await addBook({
      title: 'Clean Code',
      author_name: 'Robert C. Martin',
      total_pages: 464,
      status: 'reading',
      category: 'Programming',
    })
    if (error) console.error('Error adding book:', error)
    else console.log('Book added:', data)
  }

  // Get all books
  const listBooks = async () => {
    const { data, error } = await getBooks()
    if (error) console.error('Error fetching books:', error)
    else console.log('My books:', data)
  }

  // Get books by status
  const listReadingBooks = async () => {
    const { data, error } = await getBooks('reading')
    if (error) console.error('Error fetching books:', error)
    else console.log('Currently reading:', data)
  }

  // Update book status
  const markAsCompleted = async (bookId: string) => {
    const { data, error } = await updateBook(bookId, {
      status: 'completed',
      completed_reading_at: new Date().toISOString(),
    })
    if (error) console.error('Error updating book:', error)
    else console.log('Book marked as completed:', data)
  }

  // Update reading progress
  const updateMyProgress = async (bookId: string) => {
    const { data, error } = await updateProgress(bookId, 150, 464)
    if (error) console.error('Error updating progress:', error)
    else console.log('Progress updated:', data)
  }

  // Add a note
  const addMyNote = async (bookId: string) => {
    const { data, error } = await addNote(
      bookId,
      'This is a great insight about clean code principles.',
      'note',
      42
    )
    if (error) console.error('Error adding note:', error)
    else console.log('Note added:', data)
  }

  // Add a highlight
  const addHighlight = async (bookId: string) => {
    const { data, error } = await addNote(
      bookId,
      'Functions should do one thing and do it well.',
      'highlight',
      58,
      '#yellow'
    )
    if (error) console.error('Error adding highlight:', error)
    else console.log('Highlight added:', data)
  }

  // Get notes for a book
  const viewNotes = async (bookId: string) => {
    const { data, error } = await getNotes(bookId)
    if (error) console.error('Error fetching notes:', error)
    else console.log('Book notes:', data)
  }

  // Set reading goal
  const setGoal = async () => {
    const { data, error } = await setReadingGoal(24) // 24 books per year
    if (error) console.error('Error setting goal:', error)
    else console.log('Goal set:', data)
  }

  // Get current reading goal
  const viewGoal = async () => {
    const { data, error } = await getReadingGoal()
    if (error) console.error('Error fetching goal:', error)
    else console.log('My reading goal:', data)
  }

  return (
    <div>
      <h2>Biblioteca Examples</h2>
      <button onClick={addNewBook}>Add New Book</button>
      <button onClick={listBooks}>List All Books</button>
      <button onClick={listReadingBooks}>Currently Reading</button>
      <button onClick={() => updateMyProgress('book-uuid')}>
        Update Progress
      </button>
      <button onClick={() => addMyNote('book-uuid')}>Add Note</button>
      <button onClick={setGoal}>Set Reading Goal (24 books)</button>
      <button onClick={viewGoal}>View My Goal</button>
    </div>
  )
}

/**
 * COMPLETE APP EXAMPLE
 */
export function CompleteAppExample() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {!user ? (
        <AuthenticationExamples />
      ) : (
        <>
          <h1>Welcome to exímIA OS</h1>
          <AcademyExamples />
          <BibliotecaExamples />
        </>
      )}
    </div>
  )
}
