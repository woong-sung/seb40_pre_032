/* eslint-disable */
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AnswerEditor() {
	const queryClient = useQueryClient();
	const [quillText, setQuillText] = useState('');
	const handleTextChange = (e) => {
		setQuillText(e);
	};

	const { questionId } = useParams();
	const addAnswer = useMutation((newAnswer) => {
		return axios.post(
			`http://cors-anywhere.herokuapp.com/http://ec2-43-201-80-20.ap-northeast-2.compute.amazonaws.com:8080/answers/${questionId}/add`,
			newAnswer,
		);
	});

	const handleSubmit = () => {
		const newAnswer = {
			questionId,
			answerContent: quillText,
		};
		addAnswer.mutate(newAnswer, {
			onSuccess: () => {
				return queryClient.invalidateQueries(['question', questionId]);
			},
		});
	};

	return (
		<main>
			<article>
				<section className="h-[500px] w-[770px] mt-4">
					<h3 className="text-xl mb-4">Your Answer</h3>
					<div>
						<ReactQuill
							theme="snow"
							value={quillText}
							onChange={handleTextChange}
							className="h-[200px]"
						/>
						<button
							className="mt-16 rounded-sm text-sm p-2 text-white bg-[#0a94ff] hover:bg-[#0074CC]"
							type="submit"
							onClick={handleSubmit}
						>
							Ask Question
						</button>
					</div>
				</section>
			</article>
		</main>
	);
}

export default AnswerEditor;
